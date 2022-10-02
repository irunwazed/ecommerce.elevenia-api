import express from "express";
import router from "./config/router";
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fileUpload from 'express-fileupload';

dotenv.config();
const app = express();
app.use(cors({
  origin: '*'
}));
app.use(fileUpload({
  createParentPath: true,
}));
app.use(express.static(path.resolve('./public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

export default app;