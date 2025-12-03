import supertest from 'supertest';
import app from '../../../src/server';

const request = supertest(app);
let token = '';
let orderId: number;
let productId: number;
let orderItemId: number;
let userId: number;
const userEmail = `item.user${Date.now()}@example.com`;
let createOrderItemResponse: supertest.Response;

describe('Order Items API', () => {
    beforeAll(async () => {
        const user = await request.post('/users').send({
            first_name: 'Item',
            last_name: 'User',
            email: userEmail,
            password: 'password123',
        });
        token = user.body.token;
        userId = user.body.user.id;

        const product = await request
            .post('/products')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Phone',
                price: 500,
                category: 'Electronics',
            });
        productId = product.body.id;

        const order = await request
            .post('/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
                user_id: userId,
                status: 'active',
            });
        orderId = order.body.id;

        createOrderItemResponse = await request
            .post('/order-items')
            .set('Authorization', `Bearer ${token}`)
            .send({
                order_id: orderId,
                product_id: productId,
                quantity: 2,
            });
        orderItemId = createOrderItemResponse.body.id;
    });

    it('should add product to order', async () => {
        expect(createOrderItemResponse.status).toBe(200);
        expect(orderItemId).toBeDefined();
        expect(createOrderItemResponse.body.quantity).toBe(2);
    });

    it('should get all order items', async () => {
        const res = await request.get('/order-items').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });
});
