import pool from '../database';

export type Product = {
    id?: number;
    name: string;
    description?: string;
    price: number;
    sku?: string;
    stock: number;
    image_url?: string;
    created_at?: Date;
    updated_at?: Date;
};

export class ProductModel {
    async index(): Promise<Product[]> {
        const conn = await pool.connect();
        try {
            const sql = 'SELECT * FROM products';
            const result = await conn.query(sql);
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get products: ${(err as Error).message}`);
        } finally {
            conn.release();
        }
    }

    async show(id: number): Promise<Product> {
        const conn = await pool.connect();
        try {
            const sql = 'SELECT * FROM products WHERE id = $1';
            const result = await conn.query(sql, [id]);

            if (result.rows.length === 0) {
                throw new Error(`Product with id ${id} not found`);
            }

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find product ${id}: ${(err as Error).message}`);
        } finally {
            conn.release();
        }
    }

    async create(p: Product): Promise<Product> {
        const conn = await pool.connect();
        try {
            const sql = `
                INSERT INTO products (name, description, price, sku, stock, image_url) 
                VALUES ($1, $2, $3, $4, $5, $6) 
                RETURNING *
            `;
            const result = await conn.query(sql, [
                p.name,
                p.description || null,
                p.price,
                p.sku || null,
                p.stock || 0,
                p.image_url || null
            ]);
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not create product: ${(err as Error).message}`);
        } finally {
            conn.release();
        }
    }

    async update(id: number, p: Product): Promise<Product> {
        const conn = await pool.connect();
        try {
            const sql = `
                UPDATE products 
                SET name = $1, description = $2, price = $3, sku = $4, 
                    stock = $5, image_url = $6, updated_at = NOW() 
                WHERE id = $7 
                RETURNING *
            `;
            const result = await conn.query(sql, [
                p.name,
                p.description || null,
                p.price,
                p.sku || null,
                p.stock || 0,
                p.image_url || null,
                id
            ]);

            if (result.rows.length === 0) {
                throw new Error(`Product with id ${id} not found`);
            }

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not update product ${id}: ${(err as Error).message}`);
        } finally {
            conn.release();
        }
    }

    async delete(id: number): Promise<Product> {
        const conn = await pool.connect();
        try {
            const sql = 'DELETE FROM products WHERE id = $1 RETURNING *';
            const result = await conn.query(sql, [id]);

            if (result.rows.length === 0) {
                throw new Error(`Product with id ${id} not found`);
            }

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not delete product ${id}: ${(err as Error).message}`);
        } finally {
            conn.release();
        }
    }
}