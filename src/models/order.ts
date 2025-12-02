import pool from '../database';
import { OrderItem } from './orderItem';

export type Order = {
    id?: number;
    user_id: number;
    status: string;
    total: number;
    shipping_address?: string;
    created_at?: Date;
    updated_at?: Date;
};

export type OrderWithDetails = Order & {
    order_items?: OrderItem[];
    user_name?: string;
};

export class OrderModel {
    async index(): Promise<Order[]> {
        try {
            const conn = await pool.connect();
            const sql = 'SELECT * FROM orders ORDER BY created_at DESC';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get orders: ${err}`);
        }
    }

    async show(id: number): Promise<OrderWithDetails> {
        try {
            const conn = await pool.connect();

            const orderSql = `
        SELECT o.*, u.first_name, u.last_name 
        FROM orders o 
        JOIN users u ON o.user_id = u.id 
        WHERE o.id = $1
      `;
            const orderResult = await conn.query(orderSql, [id]);

            if (orderResult.rows.length === 0) {
                throw new Error(`Order ${id} not found`);
            }

            const order = orderResult.rows[0];

            const itemsSql = `
        SELECT oi.*, p.name as product_name, p.image_url 
        FROM order_items oi 
        JOIN products p ON oi.product_id = p.id 
        WHERE oi.order_id = $1
      `;
            const itemsResult = await conn.query(itemsSql, [id]);

            conn.release();

            return {
                ...order,
                order_items: itemsResult.rows,
                user_name: `${order.first_name} ${order.last_name}`
            };
        } catch (err) {
            throw new Error(`Could not find order ${id}: ${err}`);
        }
    }

    async create(o: Order): Promise<Order> {
        try {
            const conn = await pool.connect();
            const sql = `
        INSERT INTO orders (user_id, status, total, shipping_address) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *
      `;
            const result = await conn.query(sql, [
                o.user_id,
                o.status || 'active',
                o.total || 0,
                o.shipping_address || null
            ]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not create order: ${err}`);
        }
    }

    async update(id: number, o: Order): Promise<Order> {
        try {
            const conn = await pool.connect();
            const sql = `
        UPDATE orders 
        SET status = $1, total = $2, shipping_address = $3, updated_at = NOW() 
        WHERE id = $4 
        RETURNING *
      `;
            const result = await conn.query(sql, [
                o.status,
                o.total,
                o.shipping_address || null,
                id
            ]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not update order ${id}: ${err}`);
        }
    }

    async delete(id: number): Promise<Order> {
        try {
            const conn = await pool.connect();
            const sql = 'DELETE FROM orders WHERE id = $1 RETURNING *';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not delete order ${id}: ${err}`);
        }
    }

    async getUserOrders(userId: number): Promise<Order[]> {
        try {
            const conn = await pool.connect();
            const sql = 'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC';
            const result = await conn.query(sql, [userId]);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get orders for user ${userId}: ${err}`);
        }
    }

    async updateStatus(id: number, status: string): Promise<Order> {
        try {
            const conn = await pool.connect();
            const sql = 'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *';
            const result = await conn.query(sql, [status, id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not update order status ${id}: ${err}`);
        }
    }
}