import { Request, Response } from 'express';
import { CityService } from '../../services/master/city.service';

export class CityController {
  static async create(req: Request, res: Response) {
    const { name, stateId } = req.body;
    if (!name || !stateId) {
      // res.status(400).json({ error: 'Name and stateId are required' });
      // return
    }
    const city = await CityService.createCity(name, stateId);
    res.status(201).json(city);
  }

  static async get(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const city = await CityService.getCity(id);
      res.json(city);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }

  static async getAll(req: Request, res: Response) {
    const { stateId } = req.query;
    try {
      const cities = await CityService.getAllCities(stateId as string);
      res.json(cities);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name } = req.body;
    try {
      const city = await CityService.updateCity(id, name);
      res.json(city);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await CityService.deleteCity(id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }
}