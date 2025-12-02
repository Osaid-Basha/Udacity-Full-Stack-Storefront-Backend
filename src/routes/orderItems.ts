import express, { Request, Response } from 'express';
import { OrderItemModel, OrderItem } from '../models/orderItem';
import { verifyAuth, AuthRequest } from '../middleware/auth';
import { OrderModel } from '../models/order';

const orderItemModel = new OrderItemModel();
const orderModel = new OrderModel();
const router = express.Router();

router.get('/', verifyAuth, async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }

        const orderItems = await orderItemModel.index();
        res.json(orderItems);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

router.get('/:id', verifyAuth, async (req: AuthRequest, res: Response) => {
    try {
        const id = Number(req.params.id);
        const orderItem = await orderItemModel.show(id);

        const order = await orderModel.show(orderItem.order_id);

        if (req.user?.role !== 'admin' && req.user?.userId !== order.user_id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(orderItem);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

router.post('/', verifyAuth, async (req: AuthRequest, res: Response) => {
    try {
        const orderItem: OrderItem = req.body;

        const order = await orderModel.show(orderItem.order_id);

        if (req.user?.role !== 'admin' && req.user?.userId !== order.user_id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const newOrderItem = await orderItemModel.create(orderItem);
        res.status(201).json(newOrderItem);
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
});

router.put('/:id', verifyAuth, async (req: AuthRequest, res: Response) => {
    try {
        const id = Number(req.params.id);
        const orderItemData: OrderItem = req.body;

        const existingItem = await orderItemModel.show(id);

        const order = await orderModel.show(existingItem.order_id);

        if (req.user?.role !== 'admin' && req.user?.userId !== order.user_id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const updatedOrderItem = await orderItemModel.update(id, orderItemData);
        res.json(updatedOrderItem);
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
});

router.delete('/:id', verifyAuth, async (req: AuthRequest, res: Response) => {
    try {
        const id = Number(req.params.id);

        const existingItem = await orderItemModel.show(id);

        const order = await orderModel.show(existingItem.order_id);

        if (req.user?.role !== 'admin' && req.user?.userId !== order.user_id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const deletedOrderItem = await orderItemModel.delete(id);
        res.json(deletedOrderItem);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

router.get('/order/:orderId', verifyAuth, async (req: AuthRequest, res: Response) => {
    try {
        const orderId = Number(req.params.orderId);

        const order = await orderModel.show(orderId);

        if (req.user?.role !== 'admin' && req.user?.userId !== order.user_id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const orderItems = await orderItemModel.getOrderItems(orderId);
        res.json(orderItems);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

export default router;