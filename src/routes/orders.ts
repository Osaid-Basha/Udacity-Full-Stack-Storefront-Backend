import express, { Request, Response } from 'express';
import { OrderModel, Order } from '../models/order';
import { verifyAuth, AuthRequest } from '../middleware/auth';

const orderModel = new OrderModel();
const router = express.Router();

router.get('/', verifyAuth, async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }

        const orders = await orderModel.index();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

router.get('/:id', verifyAuth, async (req: AuthRequest, res: Response) => {
    try {
        const id = Number(req.params.id);
        const order = await orderModel.show(id);

        if (req.user?.role !== 'admin' && req.user?.userId !== order.user_id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(order);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

router.post('/', verifyAuth, async (req: AuthRequest, res: Response) => {
    try {
        const order: Order = {
            ...req.body,
            user_id: req.user?.userId
        };

        const newOrder = await orderModel.create(order);
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
});

router.put('/:id', verifyAuth, async (req: AuthRequest, res: Response) => {
    try {
        const id = Number(req.params.id);
        const orderData: Order = req.body;

        const existingOrder = await orderModel.show(id);
        if (req.user?.role !== 'admin' && req.user?.userId !== existingOrder.user_id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const updatedOrder = await orderModel.update(id, orderData);
        res.json(updatedOrder);
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
});

router.delete('/:id', verifyAuth, async (req: AuthRequest, res: Response) => {
    try {
        const id = Number(req.params.id);

        const existingOrder = await orderModel.show(id);
        if (req.user?.role !== 'admin' && req.user?.userId !== existingOrder.user_id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const deletedOrder = await orderModel.delete(id);
        res.json(deletedOrder);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

router.get('/user/:userId', verifyAuth, async (req: AuthRequest, res: Response) => {
    try {
        const userId = Number(req.params.userId);

        if (req.user?.role !== 'admin' && req.user?.userId !== userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const orders = await orderModel.getUserOrders(userId);
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

router.patch('/:id/status', verifyAuth, async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }

        const id = Number(req.params.id);
        const { status } = req.body;

        const updatedOrder = await orderModel.updateStatus(id, status);
        res.json(updatedOrder);
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
});

export default router;