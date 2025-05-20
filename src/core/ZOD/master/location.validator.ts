import { z } from 'zod';

// UUID validation regex (simplified for Zod)
// const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;


// Base schema for common fields
export const LocationBaseSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  cityId: z.string(),
});