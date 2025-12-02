import supertest from 'supertest';
import app from '../../../src/server';

const request = supertest(app);
let token = '';
let orderId: number;

describe('Orders API', () => {
    beforeAll(async () => {
        const user = await request.post('/users').send({
            first_name: 'Order',
            last_name: 'User',
            email: 'order@example.com',
            password: 'password123',
        });
        token = user.body.token;
    });

    it('should create a new order', async () => {
        const res = await request
            .post('/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
                user_id: 1,
                status: 'active',
            });
        expect(res.status).toBe(200);
        orderId = res.body.id;
        expect(res.body.status).toBe('active');
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
