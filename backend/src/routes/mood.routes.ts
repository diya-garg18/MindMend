import { Router, Response } from 'express';
import { z } from 'zod';
import { query } from '../config/database.js';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';

const router = Router();

// Validation schema
const moodEntrySchema = z.object({
  moodLevel: z.number().int().min(1).max(10),
  moodLabel: z.string(),
  notes: z.string().optional(),
});

// Create mood entry
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { moodLevel, moodLabel, notes } = moodEntrySchema.parse(req.body);
    
    const result = await query(
      'INSERT INTO mood_entries (user_id, mood_level, mood_label, notes) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.userId, moodLevel, moodLabel, notes || null]
    );
    
    res.status(201).json({ moodEntry: result.rows[0] });
  } catch (error) {
    console.error('Create mood entry error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create mood entry' });
  }
});

// Get user's mood entries
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate, limit = '30' } = req.query;
    
    let queryText = 'SELECT * FROM mood_entries WHERE user_id = $1';
    const params: any[] = [req.userId];
    
    if (startDate) {
      params.push(startDate);
      queryText += ` AND created_at >= $${params.length}`;
    }
    
    if (endDate) {
      params.push(endDate);
      queryText += ` AND created_at <= $${params.length}`;
    }
    
    queryText += ' ORDER BY created_at DESC';
    
    if (limit) {
      params.push(parseInt(limit as string));
      queryText += ` LIMIT $${params.length}`;
    }
    
    const result = await query(queryText, params);
    
    res.json({ moodEntries: result.rows });
  } catch (error) {
    console.error('Get mood entries error:', error);
    res.status(500).json({ error: 'Failed to fetch mood entries' });
  }
});

// Get mood statistics
router.get('/stats', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { days = '30' } = req.query;
    
    const result = await query(
      `SELECT 
        AVG(mood_level) as average_mood,
        COUNT(*) as total_entries,
        MAX(mood_level) as highest_mood,
        MIN(mood_level) as lowest_mood,
        mode() WITHIN GROUP (ORDER BY mood_label) as most_common_mood
       FROM mood_entries 
       WHERE user_id = $1 
       AND created_at >= NOW() - INTERVAL '${parseInt(days as string)} days'`,
      [req.userId]
    );
    
    res.json({ stats: result.rows[0] });
  } catch (error) {
    console.error('Get mood stats error:', error);
    res.status(500).json({ error: 'Failed to fetch mood statistics' });
  }
});

// Update mood entry
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { moodLevel, moodLabel, notes } = moodEntrySchema.parse(req.body);
    
    const result = await query(
      `UPDATE mood_entries 
       SET mood_level = $1, mood_label = $2, notes = $3
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [moodLevel, moodLabel, notes || null, id, req.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mood entry not found' });
    }
    
    res.json({ moodEntry: result.rows[0] });
  } catch (error) {
    console.error('Update mood entry error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to update mood entry' });
  }
});

// Delete mood entry
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      'DELETE FROM mood_entries WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mood entry not found' });
    }
    
    res.json({ message: 'Mood entry deleted successfully' });
  } catch (error) {
    console.error('Delete mood entry error:', error);
    res.status(500).json({ error: 'Failed to delete mood entry' });
  }
});

export default router;
