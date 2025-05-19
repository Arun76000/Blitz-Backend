import { z } from 'zod';

export const stateZod = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'State name is required'),
  code: z.string().min(1, 'State code is required'),
  countryId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid countryId'), // MongoDB ObjectId
});
