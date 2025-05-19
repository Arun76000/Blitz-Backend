import { z } from 'zod';
import { baseUserZod } from './baseuser.validator';

export const agencyZod = baseUserZod.extend({
    role: z.literal('agency'),
    agencyName: z.string(),
    agencyType: z.string(),
    profile: z.object({
        photo: z.string().optional(),
        description: z.string().optional(),
        phone: z.string(),
        telegramHandle: z.string().optional(),
        location: z.object({
            country: z.string(),
            state: z.string(),
            zipcode: z.string().regex(/^[0-9]{5,10}$/),
            addressLine: z.string(),
        }),
    }),
    licenses: z.array(
        z.object({
            type: z.string(),
            number: z.string(),
            expiryDate: z.coerce.date(),
        })
    ).optional(),
    billingInfo: z.object({ enabled: z.boolean() }).optional(),
});
