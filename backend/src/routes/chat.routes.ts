import { Router, Response } from 'express';
import { z } from 'zod';
import { query } from '../config/database.js';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';
import { getChatCompletion, generateTitle } from '../services/groq.service.js';

const router = Router();

// Validation schemas
const messageSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
  })),
  conversationId: z.string().uuid().optional(),
});

// Create or get conversation
router.post('/conversations', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      'INSERT INTO conversations (user_id) VALUES ($1) RETURNING *',
      [req.userId]
    );
    
    res.json({ conversation: result.rows[0] });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// Get user's conversations
router.get('/conversations', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      `SELECT c.*, 
        (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
        (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_at
       FROM conversations c
       WHERE c.user_id = $1
       ORDER BY c.updated_at DESC`,
      [req.userId]
    );
    
    res.json({ conversations: result.rows });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get messages for a conversation
router.get('/conversations/:id/messages', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verify conversation belongs to user
    const convCheck = await query(
      'SELECT id FROM conversations WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );
    
    if (convCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    const result = await query(
      'SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC',
      [id]
    );
    
    res.json({ messages: result.rows });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send message and get AI response
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {  try {
    const { messages, conversationId } = messageSchema.parse(req.body);
    
    let convId = conversationId;
    
    // Create new conversation if not provided
    if (!convId) {
      const convResult = await query(
        'INSERT INTO conversations (user_id) VALUES ($1) RETURNING id',
        [req.userId]
      );
      convId = convResult.rows[0].id;
    } else {
      // Verify conversation belongs to user
      const convCheck = await query(
        'SELECT id FROM conversations WHERE id = $1 AND user_id = $2',
        [convId, req.userId]
      );
      
      if (convCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
    }
    
    // Get the last user message
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    
    if (!lastUserMessage) {
      return res.status(400).json({ error: 'No user message provided' });
    }
    
    // Save user message
    await query(
      'INSERT INTO messages (conversation_id, user_id, role, content) VALUES ($1, $2, $3, $4)',
      [convId, req.userId, 'user', lastUserMessage.content]
    );
    
    // Get AI response
    const aiResponse = await getChatCompletion(messages);
    
    // Save AI message
    await query(
      'INSERT INTO messages (conversation_id, user_id, role, content, detected_mood) VALUES ($1, $2, $3, $4, $5)',
      [convId, req.userId, 'assistant', aiResponse.content, aiResponse.detectedMood]
    );
    
    // Generate title if it's a new conversation (first exchange)
    const messageCount = await query(
      'SELECT COUNT(*) as count FROM messages WHERE conversation_id = $1',
      [convId]
    );
    
    if (messageCount.rows[0].count <= 2) {
      const title = await generateTitle(messages);
      await query(
        'UPDATE conversations SET title = $1, updated_at = NOW() WHERE id = $2',
        [title, convId]
      );
    } else {
      // Just update timestamp
      await query(
        'UPDATE conversations SET updated_at = NOW() WHERE id = $1',
        [convId]
      );
    }
    
    res.json({
      conversationId: convId,
      message: {
        role: 'assistant',
        content: aiResponse.content,
        detectedMood: aiResponse.detectedMood,
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Delete conversation
router.delete('/conversations/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      'DELETE FROM conversations WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});

export default router;
