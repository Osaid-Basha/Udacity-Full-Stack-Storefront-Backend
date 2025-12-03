import express, { Request, Response } from 'express';
import { ProductModel, Product } from '../models/product';
import { verifyAuth } from '../middleware/auth';

const router = express.Router();
const productModel = new ProductModel();

// List all products
router.get('/', async (_req: Request, res: Response) => {
    try {
        const products = await productModel.index();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// Fetch a single product
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const product = await productModel.show(id);
        res.status(200).json(product);
    } catch (err) {
        res.status(404).json({ error: (err as Error).message });
    }
});

// Create a product (auth required)
router.post('/', verifyAuth, async (req: Request, res: Response) => {
    try {
        const payload: Product = req.body;
        const created = await productModel.create(payload);
        res.status(200).json(created);
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
});

// Update a product
router.put('/:id', verifyAuth, async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const payload: Product = req.body;
        const updated = await productModel.update(id, payload);
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
});

// Delete a product
router.delete('/:id', verifyAuth, async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const deleted = await productModel.delete(id);
        res.status(200).json(deleted);
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
});

export default router;
