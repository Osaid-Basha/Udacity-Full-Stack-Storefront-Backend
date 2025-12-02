import express, { Request, Response } from 'express';
import pool from '../database';
import { verifyAuth } from '../middleware/auth';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const conn = await pool.connect();
        const result = await conn.query('SELECT id, name, price, image_url FROM products ORDER BY id');
        conn.release();
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const conn = await pool.connect();
        const result = await conn.query('SELECT * FROM products WHERE id = $1', [id]);
        conn.release();
        if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

router.post('/', verifyAuth, async (req: Request, res: Response) => {
    try {
        const { name, description, price, sku, stock, image_url } = req.body;
        const conn = await pool.connect();
        const sql = `INSERT INTO products (name, description, price, sku, stock, image_url)
                 VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`;
        const result = await conn.query(sql, [name, description, price, sku, stock || 0, image_url || null]);
        conn.release();
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
});

export default router;
