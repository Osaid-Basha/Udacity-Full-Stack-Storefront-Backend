import supertest from 'supertest';
import app from '../../../src/server';

const request = supertest(app);
let token = '';

describe('Users API', () => {
    it('should create a new user and return token', async () => {
        const res = await request.post('/users').send({
            first_name: 'Test',
            last_name: 'User',
            email: 'test@example.com',
            password: 'password123',
        });
        expect(res.status).toBe(200);
        token = res.body.token;
        expect(token).toBeDefined();
    });

    it('should authenticate and return token', async () => {
        const res = await request.post('/users/login').send({
            email: 'test@example.com',
            password: 'password123',
        });
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    it('should get all users with token', async () => {
        const res = await request.get('/users').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should get single user by id', async () => {
        const res = await request.get('/users/1').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(1);
    });
});
