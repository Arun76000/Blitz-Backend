import { z } from 'zod';

// Base schema for common fields
export const CategoryZod = z.object({
    id:z.string().optional(),
    name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
    parentId: z.string().optional(),
    isSub: z.boolean().optional(),
    description: z.string().max(500, 'Description must be 500 characters or less').optional(),
});
