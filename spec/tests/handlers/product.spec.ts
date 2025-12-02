import supertest from 'supertest';
import app from '../../../src/server';

const request = supertest(app);
let token = '';
let productId: number;

describe('Products API', () => {
    beforeAll(async () => {
        const res = await request.post('/users').send({
            first_name: 'Prod',
            last_name: 'Owner',
            email: 'prod@example.com',
            password: 'password123',
        });
        token = res.body.token;
    });

    it('should create a product', async () => {
        const res = await request
            .post('/products')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Laptop',
                price: 999,
                category: 'Electronics',
            });
        expect(res.status).toBe(200);
        productId = res.body.id;
        expect(res.body.name).toBe('Laptop');
    });

    it('should get all products', async () => {
        const res = await request.get('/products');
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should get product by id', async () => {
        const res = await request.get(`/products/${productId}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(productId);
    });
});
