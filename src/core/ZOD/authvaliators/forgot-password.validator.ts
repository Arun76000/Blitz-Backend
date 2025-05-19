import { z } from 'zod';

export const forgotPasswordZod = z.object({
    email: z.string().email().nonempty()
});
