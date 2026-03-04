import { Request, Response, NextFunction } from 'express';
import { agentStore } from '../models/agentStore';

export const getAgents = (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const { data, total } = agentStore.getPaginated(page, limit);

        res.json({
            data,
            page,
            limit,
            total
        });
    } catch (error) {
        next(error);
    }
};

export const getAgentById = (req: Request, res: Response, next: NextFunction) => {
    try {
        const agent = agentStore.getById(req.params.id as string);
        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }
        res.json(agent);
    } catch (error) {
        next(error);
    }
};

export const createAgent = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, email, mobileNumber } = req.body;

        // Basic validation
        if (!firstName || !lastName || !email || !mobileNumber) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Email format validation (simplified)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Check for unique email
        if (agentStore.getByEmail(email)) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const newAgent = agentStore.create({ firstName, lastName, email, mobileNumber });
        res.status(201).json(newAgent);
    } catch (error) {
        next(error);
    }
};

export const updateAgent = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, email, mobileNumber } = req.body;
        const agentId = req.params.id as string;
        const existingAgent = agentStore.getById(agentId);
        if (!existingAgent) {
            return res.status(404).json({ message: 'Agent not found' });
        }

        // Check for unique email if email is being updated
        if (email && email !== existingAgent.email && agentStore.getByEmail(email)) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const updatedAgent = agentStore.update(req.params.id as string, { firstName, lastName, email, mobileNumber });
        res.json(updatedAgent);
    } catch (error) {
        next(error);
    }
};

export const deleteAgent = (req: Request, res: Response, next: NextFunction) => {
    try {
        const success = agentStore.delete(req.params.id as string);
        if (!success) {
            return res.status(404).json({ message: 'Agent not found' });
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
