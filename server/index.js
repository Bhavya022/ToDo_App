import express from 'express';
import router from './routes/routes.js';
import dotenv from 'dotenv' 
import cors from 'cors';
dotenv.config();
import path from 'path';
import { connectToMongoDB } from './data/db.js';
const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));
connectToMongoDB();

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "build")));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "build/index.html"));
})

app.use("/api", router)

 const port = process.env.PORT || 7000
 app.listen(port, () => {
   console.log(`Server running on port ${port}`);
 });