import { ProductModel, Product } from '../../src/models/product';
import pool from '../../src/database';

const productModel = new ProductModel();

describe('Product Model', () => {
    afterAll(async () => {
        const conn = await pool.connect();
        await conn.query('DELETE FROM products WHERE name LIKE $1', ['Test Product%']);
        conn.release();
    });

    it('should create a product', async () => {
        const product: Product = {
            name: 'Test Product',
            description: 'Test Description',
            price: 19.99,
            stock: 10
        };

        const created = await productModel.create(product);
        expect(created.name).toBe('Test Product');
        expect(Number(created.price)).toBeCloseTo(19.99);
    });

    it('should get all products', async () => {
        const products = await productModel.index();
        expect(products.length).toBeGreaterThan(0);
    });

    it('should get a specific product', async () => {
        const product: Product = {
            name: 'Test Product 2',
            price: 29.99,
            stock: 5
        };

        const created = await productModel.create(product);
        const found = await productModel.show(created.id as number);

        expect(found.name).toBe('Test Product 2');
        expect(Number(found.price)).toBeCloseTo(29.99);
    });

    it('should update a product', async () => {
        const product: Product = {
            name: 'Test Product 3',
            price: 39.99,
            stock: 8
        };

        const created = await productModel.create(product);
        const updated = await productModel.update(created.id as number, {
            ...product,
            price: 49.99
        });

        expect(Number(updated.price)).toBeCloseTo(49.99);
    });

    it('should delete a product', async () => {
        const product: Product = {
            name: 'Test Product 4',
            price: 59.99,
            stock: 3
        };

        const created = await productModel.create(product);
        await productModel.delete(created.id as number);

        await expectAsync(productModel.show(created.id as number))
            .toBeRejectedWithError();
    });
});