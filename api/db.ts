import { createPool } from 'mariadb';

import dotenv from 'dotenv'
dotenv.config()

const db_config = {
    host: process.env.DB_ADDRESS,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 14,
    connectionTimeout: 600000
}

export const pool = createPool(db_config);