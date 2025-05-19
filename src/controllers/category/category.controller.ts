import { Request, Response } from 'express';
import { CategoryService } from '../../services/category/category.service';

export class CategoryController {
  static async create(req: Request, res: Response) {
    const { name, description } = req.body;
    if (!name) {
        res.status(400).json({ error: 'Name is required' });
        return 
    }
    try {
      const category = await CategoryService.createCategory(name, description);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async get(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const category = await CategoryService.getCategory(id);
      res.json(category);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const categories = await CategoryService.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
      const category = await CategoryService.updateCategory(id, name, description);
      res.json(category);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await CategoryService.deleteCategory(id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }
}