import { pool } from "./db";
import express from 'express'
import dotenv from 'dotenv'
import { PoolConnection } from "mariadb";
import cors from 'cors'
import bodyParser from "body-parser";
import fs from 'fs'
dotenv.config()

dotenv.config();

const signUpTokenABI = JSON.parse(fs.readFileSync('./abi/SignUpToken.json').toString()).abi

const app = express();
app.use(bodyParser.json({limit: "550mb"}));
app.use(bodyParser.urlencoded({limit: "150mb", extended: true, parameterLimit:50000}));
const corsOptions = {
    origin: '*',
    optionSuccessStatus: 200,
    methods: ['GET', 'POST']
}
app.use(cors(corsOptions));
app.use(express.json());
app.options('*', cors());

app.post('/movie', async (req, res) => {
    const movieData = req.body

    const db: PoolConnection = await pool.getConnection()
    try {
        await db.query(`INSERT INTO movies (title, url, imageUrl) VALUES(?, ?, ?);`, [
            movieData.title, movieData.url, movieData.imageUrl
        ])
        res.status(200).json('Success')
    } catch (e) {
        res.status(500)
    } finally {
        if (db) db.release()
    }
})

app.get('/movies', async (req, res) => {
    const db: PoolConnection = await pool.getConnection()
    try {
        const rows = await db.query(`SELECT * FROM movies;`)
        if (rows.length === 0) {
            res.status(204)
            return 
        } 
        res.status(200).json(rows)
    } catch (e) {
        res.status(500)
    } finally {
        if (db) db.release()
    }
})

app.listen(8000)