import { Router, Response } from 'express';
import { z } from 'zod';
import { query } from '../config/database.js';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';

const router = Router();

// Validation schema
const profileUpdateSchema = z.object({
  displayName: z.string().optional(),
  username: z.string().optional(),
  nickname: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  contactInfo: z.string().optional(),
  location: z.string().optional(),
});

// Get user profile
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      'SELECT * FROM profiles WHERE user_id = $1',
      [req.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.json({ profile: result.rows[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const updates = profileUpdateSchema.parse(req.body);
    
    // Check if username is being updated and if it's unique
    if (updates.username) {
      const existingUser = await query(
        'SELECT id FROM profiles WHERE username = $1 AND user_id != $2',
        [updates.username.toLowerCase(), req.userId]
      );
      
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Username is already taken' });
      }
    }
    
    // Build dynamic update query
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        // Convert camelCase to snake_case
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    values.push(req.userId);
    
    const result = await query(
      `UPDATE profiles 
       SET ${fields.join(', ')}, updated_at = NOW()
       WHERE user_id = $${paramCount}
       RETURNING *`,
      values
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.json({ profile: result.rows[0] });
  } catch (error) {
    console.error('Update profile error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;