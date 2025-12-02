import { UserModel } from '../../src/models/user';
import pool from '../../src/database';

const userModel = new UserModel();

describe('User Model', () => {
    beforeAll(async () => {
    });

    afterAll(async () => {
        const conn = await pool.connect();
        await conn.query('DELETE FROM users WHERE email LIKE $1', ['test.user%@example.com']);
        conn.release();
    });

    it('should create a user', async () => {
        const user = {
            first_name: 'Test',
            last_name: 'User',
            email: `test.user${Date.now()}@example.com`,
            password: 'password123'
        };
        const created = await userModel.create(user);
        expect(created.email).toBeDefined();
        expect(created.first_name).toBe('Test');
    });

    it('should authenticate a created user and return token', async () => {
        const email = `test.user${Date.now()}@example.com`;
        await userModel.create({ first_name: 'Auth', last_name: 'User', email, password: 'mypw' });
        const token = await userModel.authenticate(email, 'mypw');
        expect(token).toBeTruthy();
    });
});
