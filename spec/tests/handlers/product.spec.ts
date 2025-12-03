import supertest from 'supertest';
import app from '../../../src/server';

const request = supertest(app);
let token = '';
let productId: number;
const userEmail = `prod.user${Date.now()}@example.com`;
let createProductResponse: supertest.Response;

describe('Products API', () => {
    beforeAll(async () => {
        const res = await request.post('/users').send({
            first_name: 'Prod',
            last_name: 'Owner',
            email: userEmail,
            password: 'password123',
        });
        token = res.body.token;

        createProductResponse = await request
            .post('/products')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Laptop',
                price: 999,
                category: 'Electronics',
            });
        productId = createProductResponse.body.id;
    });

    it('should create a product', async () => {
        expect(createProductResponse.status).toBe(200);
        expect(productId).toBeDefined();
        expect(createProductResponse.body.name).toBe('Laptop');
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
