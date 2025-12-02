import express, { Request, Response } from 'express';
import { UserModel } from '../models/user';
import { verifyAuth, AuthRequest } from '../middleware/auth';

const userModel = new UserModel();
const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    try {
        const created = await userModel.create(req.body);
        const token = await userModel.authenticate(req.body.email, req.body.password);
        res.status(201).json({ user: created, token });
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
});

router.post('/authenticate', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const token = await userModel.authenticate(email, password);
        if (!token) return res.status(401).json({ error: 'Invalid credentials' });
        res.json({ token });
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
});

router.get('/', verifyAuth, async (req: AuthRequest, res: Response) => {
    try {
        const users = await userModel.index();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

router.get('/:id', verifyAuth, async (req: AuthRequest, res: Response) => {
    try {
        const id = Number(req.params.id);
        const user = await userModel.show(id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

export default router;
