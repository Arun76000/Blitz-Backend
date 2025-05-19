import { z } from 'zod';

export const loginZod = z.object({
    email: z.string().email().nonempty(),
    password: z.string().min(8).nonempty(),
});
