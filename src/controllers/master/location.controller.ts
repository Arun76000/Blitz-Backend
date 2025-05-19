import { Request, Response } from 'express';
import { LocationService } from '../../services/master/location.service';

export class LocationController {
    static async create(req: Request, res: Response) {
        const { name, cityId } = req.body;
        if (!name || !cityId) {
            res.status(400).json({ error: 'Name and cityId are required' });
            return
        }
        try {
            const location = await LocationService.createLocation(name, cityId);
            res.status(201).json(location);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    static async get(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const location = await LocationService.getLocation(id);
            res.json(location);
        } catch (error) {
            res.status(404).json({ error: (error as Error).message });
        }
    }

    static async getAll(req: Request, res: Response) {
        const { cityId } = req.query;
        try {
            const locations = await LocationService.getAllLocations(cityId as string);
            res.json(locations);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    static async update(req: Request, res: Response) {
        const { id } = req.params;
        const { name } = req.body;
        try {
            const location = await LocationService.updateLocation(id, name);
            res.json(location);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    static async delete(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await LocationService.deleteLocation(id);
            res.status(204).send();
        } catch (error) {
            res.status(404).json({ error: (error as Error).message });
        }
    }
}