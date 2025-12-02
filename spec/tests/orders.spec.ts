import { OrderModel, Order } from '../../src/models/order';
import { UserModel } from '../../src/models/user';
import pool from '../../src/database';

const orderModel = new OrderModel();
const userModel = new UserModel();

describe('Order Model', () => {
  let testUserId: number;

  beforeAll(async () => {
    const user = await userModel.create({
      first_name: 'Order',
      last_name: 'Test',
      email: `order.test${Date.now()}@example.com`,
      password: 'password123'
    });
    testUserId = user.id as number;

    await orderModel.create({
      user_id: testUserId,
      status: 'active',
      total: 10,
      shipping_address: '123 Test St'
    });
  });

  afterAll(async () => {
    const conn = await pool.connect();
    await conn.query('DELETE FROM orders WHERE user_id = $1', [testUserId]);
    await conn.query('DELETE FROM users WHERE id = $1', [testUserId]);
    conn.release();
  });

  it('should create an order', async () => {
    const order: Order = {
      user_id: testUserId,
      status: 'active',
      total: 99.99,
      shipping_address: '123 Test St'
    };

    const created = await orderModel.create(order);
    expect(created.user_id).toBe(testUserId);
    expect(created.status).toBe('active');
  });

  it('should get user orders', async () => {
    const orders = await orderModel.getUserOrders(testUserId);
    expect(orders.length).toBeGreaterThan(0);
  });

  it('should get a specific order', async () => {
    const order: Order = {
      user_id: testUserId,
      status: 'active',
      total: 49.99
    };

    const created = await orderModel.create(order);
    const found = await orderModel.show(created.id as number);

    expect(found.user_id).toBe(testUserId);
    expect(found.status).toBe('active');
  });

  it('should update an order', async () => {
    const order: Order = {
      user_id: testUserId,
      status: 'active',
      total: 29.99
    };

    const created = await orderModel.create(order);
    const updated = await orderModel.update(created.id as number, {
      ...order,
      status: 'completed'
    });

    expect(updated.status).toBe('completed');
  });
});
