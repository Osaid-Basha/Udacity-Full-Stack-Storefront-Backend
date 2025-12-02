// src/database.ts
import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';

const {
    DB_HOST = 'localhost',
    DB_PORT = '5432',
    DB_NAME = 'storefront_dev',
    DB_USER = 'postgres',
    DB_PASSWORD = 'postgres',
    NODE_ENV
} = process.env;

const database = NODE_ENV === 'test' ? (process.env.DB_NAME_TEST || 'storefront_test') : DB_NAME;

const pool = new Pool({
    host: DB_HOST,
    port: Number(DB_PORT),
    database,
    user: DB_USER,
    password: DB_PASSWORD,
});

export default pool;
