import { Request, Response } from 'express';
import { StateService } from '../../services/master/state.service';

export class StateController {
    static async create(req: Request, res: Response) {
        const { name, code, countryId } = req.body;
        if (!name || !code || !countryId) {
            res.status(400).json({ error: 'Name, code, and countryId are required' });
            // return
        }
        try {
            const state = await StateService.createState(name, code, countryId);
            res.status(201).json(state);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    static async get(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const state = await StateService.getState(id);
            res.json(state);
        } catch (error) {
            res.status(404).json({ error: (error as Error).message });
        }
    }

    static async getAll(req: Request, res: Response) {
        const { countryId } = req.query;
        try {
            const states = await StateService.getAllStates(countryId as string);
            res.json(states);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    static async update(req: Request, res: Response) {
        const { id } = req.params;
        const { name, code } = req.body;
        try {
            const state = await StateService.updateState(id, name, code);
            res.json(state);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    static async delete(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await StateService.deleteState(id);
            res.status(204).send();
        } catch (error) {
            res.status(404).json({ error: (error as Error).message });
        }
    }
}