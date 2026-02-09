import { Router, Response } from 'express';
import { z } from 'zod';
import { query } from '../config/database.js';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';

const router = Router();

// Validation schema
const journalEntrySchema = z.object({
  prompt: z.string().optional(),
  content: z.string().min(1),
});

// Create journal entry
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { prompt, content } = journalEntrySchema.parse(req.body);
    
    const result = await query(
      'INSERT INTO journal_entries (user_id, prompt, content) VALUES ($1, $2, $3) RETURNING *',
      [req.userId, prompt || null, content]
    );
    
    res.status(201).json({ journalEntry: result.rows[0] });
  } catch (error) {
    console.error('Create journal entry error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create journal entry' });
  }
});

// Get user's journal entries
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { limit = '50', offset = '0' } = req.query;
    
    const result = await query(
      `SELECT * FROM journal_entries 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [req.userId, parseInt(limit as string), parseInt(offset as string)]
    );
    
    res.json({ journalEntries: result.rows });
  } catch (error) {
    console.error('Get journal entries error:', error);
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
});

// Get single journal entry
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      'SELECT * FROM journal_entries WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }
    
    res.json({ journalEntry: result.rows[0] });
  } catch (error) {
    console.error('Get journal entry error:', error);
    res.status(500).json({ error: 'Failed to fetch journal entry' });
  }
});

// Update journal entry
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { prompt, content } = journalEntrySchema.parse(req.body);
    
    const result = await query(
      `UPDATE journal_entries 
       SET prompt = $1, content = $2
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [prompt || null, content, id, req.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }
    
    res.json({ journalEntry: result.rows[0] });
  } catch (error) {
    console.error('Update journal entry error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to update journal entry' });
  }
});

// Delete journal entry
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      'DELETE FROM journal_entries WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }
    
    res.json({ message: 'Journal entry deleted successfully' });
  } catch (error) {
    console.error('Delete journal entry error:', error);
    res.status(500).json({ error: 'Failed to delete journal entry' });
  }
});

export default router;
