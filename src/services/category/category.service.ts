import { Request } from "express";
import { FindById, paginationData } from "../../core/helper/helper.service";
import { CategoryModel, ICategory } from "../../model/category.model";
import { CategoryResponse } from "../../types/common.types";

export class CategoryService {
  static async createCategory(
    name: string,
    description?: string
  ): Promise<CategoryResponse> {
    const existingCategory = await CategoryModel.findOne({ name });
    if (existingCategory) {
      throw new Error("Category name already exists");
    }
    const category = await CategoryModel.create({ name, description });
    return CategoryService.mapToResponse(category);
  }

  static async getCategory(id: string): Promise<CategoryResponse> {
    // const category = await CategoryModel.findOne({ id });
    // if (!category) {
    //   throw new Error("Category not found");
    // }
    const category = await FindById(CategoryModel, id, [
      { path: "parentId", select: "name" },
    ]);
    return CategoryService.mapToResponse(category);
  }

  static async getAllCategories(): Promise<CategoryResponse[]> {
    const categories = await CategoryModel.find().sort({ createdAt: -1 });
    return categories.map(CategoryService.mapToResponse);
  }

  static async getAllCategory(req: Request): Promise<any> {
    const { data, page_data } = await paginationData(
      req,
      CategoryModel,
      [],
      ["name"],
      []
    );
    return { data, page_data };
  }

  static async updateCategory(
    id: string,
    name?: string,
    description?: string,
    status?: boolean
  ): Promise<CategoryResponse> {
    const category = await CategoryModel.findOne({ id });
    if (!category) {
      throw new Error("Category not found");
    }
    // console.log('Category found:', status);
    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (status !== undefined) category.status = status;
    await category.save();
    return CategoryService.mapToResponse(category);
  }

  static async deleteCategory(id: string): Promise<void> {
    const category = await CategoryModel.findOne({ id });
    if (!category) {
      throw new Error("Category not found");
    }
    await CategoryModel.deleteOne({ id });
  }

  private static mapToResponse(category: ICategory): CategoryResponse {
    return {
      id: category.id,
      name: category.name,
      parentId: category.parentId,
      isSub: category.isSub,
      description: category.description,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      status: category.status,
      softDelete: category.softDelete,
    };
  }
}
