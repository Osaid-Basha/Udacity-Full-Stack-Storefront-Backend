import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import usersRoutes from './routes/users';
import productsRoutes from './routes/products';
import ordersRoutes from './routes/orders';
import orderItemsRoutes from './routes/orderItems';
import cors from 'cors';

dotenv.config();

const app: express.Application = express();
const port = process.env.PORT || 3000;
const address: string = `0.0.0.0:${port}`;

app.use(cors());
app.use(bodyParser.json());

app.get('/', function (req: Request, res: Response) {
    res.send('Storefront API is running!');
});

app.use('/users', usersRoutes);
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);
app.use('/order-items', orderItemsRoutes);

app.listen(port, function () {
    console.log(`starting app on: ${address}`);
});

export default app;