import { z } from "zod";


export const resetPasswordZod = z.object({
    token: z.string().email().nonempty(),
    newPassword: z.string().min(8).nonempty(),
});