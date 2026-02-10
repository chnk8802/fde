import {createServer} from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderController.js';
import { initSocket } from './config/socket.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

initSocket(httpServer);

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});