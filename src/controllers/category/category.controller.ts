import { Request, Response } from 'express';
import { CategoryService } from '../../services/category/category.service';
import { sendResponse } from '../../core/helper/helper.service';

export class CategoryController {
  static async create(req: Request, res: Response) {
    const { name, description } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return
    }
    const category = await CategoryService.createCategory(name, description);
    sendResponse(res, 201, "Created successfully", category);
  }

  static async get(req: Request, res: Response) {
    const { id } = req.params;
    const category = await CategoryService.getCategory(id);
    sendResponse(res, 201, "fetched successfully", category);
  }

  static async getAll(req: Request, res: Response) {
    const categories = await CategoryService.getAllCategories();
    sendResponse(res, 201, "fetched successfully", categories);
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, description } = req.body;
    const category = await CategoryService.updateCategory(id, name, description);
    sendResponse(res, 201, "updated successfully", category);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    await CategoryService.deleteCategory(id);
    sendResponse(res, 201, "deeted successfully");
  }
}