import pool from '../database';

export type OrderItem = {
    id?: number;
    order_id: number;
    product_id: number;
    quantity: number;
    unit_price: number;
    created_at?: Date;
};

export type OrderItemWithDetails = OrderItem & {
    product_name?: string;
    product_image?: string;
    total_price?: number;
};

export class OrderItemModel {
    async index(): Promise<OrderItem[]> {
        try {
            const conn = await pool.connect();
            const sql = 'SELECT * FROM order_items';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get order items: ${err}`);
        }
    }

    async show(id: number): Promise<OrderItemWithDetails> {
        try {
            const conn = await pool.connect();
            const sql = `
        SELECT oi.*, p.name as product_name, p.image_url as product_image 
        FROM order_items oi 
        JOIN products p ON oi.product_id = p.id 
        WHERE oi.id = $1
      `;
            const result = await conn.query(sql, [id]);
            conn.release();

            if (result.rows.length === 0) {
                throw new Error(`Order item ${id} not found`);
            }

            const item = result.rows[0];
            return {
                ...item,
                total_price: item.quantity * item.unit_price
            };
        } catch (err) {
            throw new Error(`Could not find order item ${id}: ${err}`);
        }
    }

    async create(oi: OrderItem): Promise<OrderItem> {
        try {
            const conn = await pool.connect();
            const sql = `
        INSERT INTO order_items (order_id, product_id, quantity, unit_price) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *
      `;
            const result = await conn.query(sql, [
                oi.order_id,
                oi.product_id,
                oi.quantity,
                oi.unit_price
            ]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not create order item: ${err}`);
        }
    }

    async update(id: number, oi: OrderItem): Promise<OrderItem> {
        try {
            const conn = await pool.connect();
            const sql = `
        UPDATE order_items 
        SET quantity = $1, unit_price = $2 
        WHERE id = $3 
        RETURNING *
      `;
            const result = await conn.query(sql, [
                oi.quantity,
                oi.unit_price,
                id
            ]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not update order item ${id}: ${err}`);
        }
    }

    async delete(id: number): Promise<OrderItem> {
        try {
            const conn = await pool.connect();
            const sql = 'DELETE FROM order_items WHERE id = $1 RETURNING *';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not delete order item ${id}: ${err}`);
        }
    }

    async getOrderItems(orderId: number): Promise<OrderItemWithDetails[]> {
        try {
            const conn = await pool.connect();
            const sql = `
        SELECT oi.*, p.name as product_name, p.image_url as product_image 
        FROM order_items oi 
        JOIN products p ON oi.product_id = p.id 
        WHERE oi.order_id = $1
      `;
            const result = await conn.query(sql, [orderId]);
            conn.release();

            return result.rows.map(item => ({
                ...item,
                total_price: item.quantity * item.unit_price
            }));
        } catch (err) {
            throw new Error(`Could not get order items for order ${orderId}: ${err}`);
        }
    }
}