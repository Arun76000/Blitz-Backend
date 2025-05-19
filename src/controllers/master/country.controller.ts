import { Request, Response } from 'express';
import { CountryService } from '../../services/master/country.service';
import { ExpressRequest } from '../../core/configuration/express-request-extend';

export class CountryController {
  static async create(req: Request, res: Response) {
    const body = req.body;
    try {
      const country = await CountryService.createCountry(body);
      res.json(country);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async get(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const country = await CountryService.getCountry(id);
      res.json(country);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const countries = await CountryService.getAllCountries();
      res.json(countries);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, code } = req.body;
    try {
      const country = await CountryService.updateCountry(id, name, code);
      res.json(country);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await CountryService.deleteCountry(id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }
}
