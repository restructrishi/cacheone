import { Router } from 'express';
import { query } from '../../config/db.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const result = await query('SELECT id, name, slug FROM modules ORDER BY slug');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
});

export default router;
