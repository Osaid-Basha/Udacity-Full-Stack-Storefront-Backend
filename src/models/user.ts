import pool from '../database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 10;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export type User = {
    id?: number;
    first_name: string;
    last_name?: string;
    email: string;
    password?: string;
    password_hash?: string;
    role?: string;
    created_at?: Date;
    updated_at?: Date;
};

export type UserWithoutPassword = Omit<User, 'password' | 'password_hash'>;

export class UserModel {
    async create(u: User): Promise<UserWithoutPassword> {
        const conn = await pool.connect();
        try {
            const hash = await bcrypt.hash(u.password as string, BCRYPT_ROUNDS);
            const sql = `
                INSERT INTO users (first_name, last_name, email, password_hash, role) 
                VALUES ($1, $2, $3, $4, $5) 
                RETURNING id, first_name, last_name, email, role, created_at
            `;
            const result = await conn.query(sql, [
                u.first_name,
                u.last_name || null,
                u.email,
                hash,
                u.role || 'customer'
            ]);
            return result.rows[0];
        } catch (err: any) {
            if (err.code === '23505') { // Unique violation
                throw new Error('Email already exists');
            }
            throw new Error(`Could not create user: ${err.message}`);
        } finally {
            conn.release();
        }
    }

    async index(): Promise<UserWithoutPassword[]> {
        const conn = await pool.connect();
        try {
            const sql = 'SELECT id, first_name, last_name, email, role, created_at FROM users';
            const result = await conn.query(sql);
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get users: ${(err as Error).message}`);
        } finally {
            conn.release();
        }
    }

    async show(id: number): Promise<UserWithoutPassword> {
        const conn = await pool.connect();
        try {
            const sql = 'SELECT id, first_name, last_name, email, role, created_at FROM users WHERE id = $1';
            const result = await conn.query(sql, [id]);

            if (result.rows.length === 0) {
                throw new Error(`User with id ${id} not found`);
            }

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find user ${id}: ${(err as Error).message}`);
        } finally {
            conn.release();
        }
    }

    async authenticate(email: string, password: string): Promise<string | null> {
        const conn = await pool.connect();
        try {
            const sql = 'SELECT id, password_hash, role FROM users WHERE email = $1';
            const result = await conn.query(sql, [email]);

            if (result.rows.length === 0) {
                return null;
            }

            const user = result.rows[0];
            const match = await bcrypt.compare(password, user.password_hash);

            if (match) {
                const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
                const token = jwt.sign(
                    { userId: user.id, role: user.role },
                    JWT_SECRET,
                    { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] }
                );
                return token;
            }

            return null;
        } catch (err) {
            throw new Error(`Authentication error: ${(err as Error).message}`);
        } finally {
            conn.release();
        }
    }
}