import { z } from 'zod';

export const countryZod = z.object({
  id: z.string().optional(), // Optional for creation; can be added if needed
  name: z.string().min(1, 'Country name is required'),
  code: z.string().min(2).max(3), // ISO codes are usually 2-3 chars
  currency: z.string().min(1, 'Currency is required'),
});
