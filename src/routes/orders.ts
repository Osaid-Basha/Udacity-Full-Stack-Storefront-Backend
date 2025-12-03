import express, { Request, Response } from 'express';
import { OrderModel, Order } from '../models/order';
import { verifyAuth, AuthRequest } from '../middleware/auth';

const orderModel = new OrderModel();
const router = express.Router();

router.get('/', verifyAuth, async (req: AuthRequest, res: Response) => {
    try {
        const orders = req.user?.role === 'admin'
            ? await orderModel.index()
            : await orderModel.getUserOrders(req.user?.userId as number);
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

router.get('/:userId/current', verifyAuth, async (req: AuthRequest, res: Response) => {
    try {
        const userId = Number(req.params.userId);
        if (req.user?.role !== 'admin' && req.user?.userId !== userId) {
            return res.status(403).json({ error: 'Access denied' });
        }
        const currentOrder = await orderModel.getCurrentOrderByUser(userId);
        res.status(200).json(currentOrder);
    } catch (err) {
        res.status(404).json({ error: (err as Error).message });
    }
});

router.get('/:userId/completed', verifyAuth, async (req: AuthRequest, res: Response) => {
    try {
        const userId = Number(req.params.userId);
        if (req.user?.role !== 'admin' && req.user?.userId !== userId) {
            return res.status(403).json({ error: 'Access denied' });
        }
        const completedOrders = await orderModel.getCompletedOrdersByUser(userId);
        res.status(200).json(completedOrders);
    } catch (err) {
        res.status(404).json({ error: (err as Error).message });
    }
});

router.get('/:id', verifyAuth, async (req: AuthRequest, res: Response) => {
    try {
        const id = Number(req.params.id);
        const order = await orderModel.show(id);

        if (req.user?.role !== 'admin' && req.user?.userId !== order.user_id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

router.post('/', verifyAuth, async (req: AuthRequest, res: Response) => {
    try {
        const order: Order = {
            ...req.body,
            user_id: req.user?.userId || req.body.user_id
        };

        const newOrder = await orderModel.create(order);
        res.status(200).json(newOrder);
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
        res.status(200).json(updatedOrder);
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
        res.status(200).json(deletedOrder);
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
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
});

export default router;
