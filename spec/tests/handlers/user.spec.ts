import supertest from 'supertest';
import app from '../../../src/server';

const request = supertest(app);
let token = '';
let userId: number;
const email = `test.user${Date.now()}@example.com`;
const password = 'password123';
let createUserResponse: supertest.Response;

describe('Users API', () => {
    beforeAll(async () => {
        createUserResponse = await request.post('/users').send({
            first_name: 'Test',
            last_name: 'User',
            email,
            password,
        });
        token = createUserResponse.body.token;
        userId = createUserResponse.body.user.id;
    });

    it('should create a new user and return token', async () => {
        expect(createUserResponse.status).toBe(200);
        expect(token).toBeDefined();
        expect(userId).toBeDefined();
    });

    it('should authenticate and return token', async () => {
        const res = await request.post('/users/login').send({
            email,
            password,
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
        const res = await request.get(`/users/${userId}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(userId);
    });
});
