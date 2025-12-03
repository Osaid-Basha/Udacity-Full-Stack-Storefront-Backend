import supertest from 'supertest';
import app from '../../../src/server';

const request = supertest(app);
let token = '';
let orderId: number;
let userId: number;
const userEmail = `order.user${Date.now()}@example.com`;
let createOrderResponse: supertest.Response;

describe('Orders API', () => {
    beforeAll(async () => {
        const user = await request.post('/users').send({
            first_name: 'Order',
            last_name: 'User',
            email: userEmail,
            password: 'password123',
        });
        token = user.body.token;
        userId = user.body.user.id;

        createOrderResponse = await request
            .post('/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
                user_id: userId,
                status: 'active',
            });
        orderId = createOrderResponse.body.id;
    });

    it('should create a new order', async () => {
        expect(createOrderResponse.status).toBe(200);
        expect(orderId).toBeDefined();
        expect(createOrderResponse.body.status).toBe('active');
    });

    it('should get all orders', async () => {
        const res = await request.get('/orders').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should get order by id', async () => {
        const res = await request.get(`/orders/${orderId}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(orderId);
    });
});
