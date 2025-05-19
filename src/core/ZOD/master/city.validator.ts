import { z } from 'zod';

export const cityZod = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'City name is required'),
  stateId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid stateId'),
});
