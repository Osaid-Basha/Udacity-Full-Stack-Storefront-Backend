import express, { Request, Response } from 'express';
import { OrderItemModel, OrderItem } from '../models/orderItem';
import { verifyAuth, AuthRequest } from '../middleware/auth';
import { OrderModel } from '../models/order';
import { ProductModel } from '../models/product';

const orderItemModel = new OrderItemModel();
const orderModel = new OrderModel();
const productModel = new ProductModel();
const router = express.Router();

router.get('/', verifyAuth, async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role === 'admin') {
            const orderItems = await orderItemModel.index();
            return res.status(200).json(orderItems);
        }

        const orders = await orderModel.getUserOrders(req.user?.userId as number);
        const items = await Promise.all(
            orders.map(async (order) => orderItemModel.getOrderItems(order.id as number))
        );
        res.status(200).json(items.flat());
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

        res.status(200).json(orderItem);
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

        const product = await productModel.show(orderItem.product_id);
        const newOrderItem = await orderItemModel.create({
            ...orderItem,
            unit_price: Number((product as any).price)
        });
        res.status(200).json(newOrderItem);
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

        const updatedOrderItem = await orderItemModel.update(id, {
            ...orderItemData,
            unit_price: orderItemData.unit_price || existingItem.unit_price
        });
        res.status(200).json(updatedOrderItem);
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
        res.status(200).json(deletedOrderItem);
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
        res.status(200).json(orderItems);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

export default router;
