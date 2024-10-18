import express from "express";
import dotenv from 'dotenv';
import conn from './conn/conn.js';
import auth from './routes/auth.routes.js'
import list from './routes/list.routes.js'
import cors from 'cors'
import path from 'path';

dotenv.config();

conn();

const app = express();
app.use(cors());
app.use(express.json())
app.use("/api/v1",auth);
app.use("/api/v2",list);

app.listen(1000, () => {
    console.log("Server Started");

});
