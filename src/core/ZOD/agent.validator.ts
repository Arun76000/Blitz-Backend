import { z } from 'zod';
import { baseUserZod } from './baseuser.validator';


export const agentZod = baseUserZod.extend({
    role: z.literal('agent'),
    firstName: z.string(),
    lastName: z.string(),
    agentProfile: z.object({
        hourlyRate: z.number().nonnegative(),
        location: z.object({
            country: z.string(),
            state: z.string(),
            zipcode: z.string().regex(/^[0-9]{5,10}$/),
            addressLine: z.string(),
        }),
        stats: z.object({
            visibility: z.enum(['Public', 'Private', 'BlitzOnly']),
            experienceLevel: z.enum(['Beginner', 'Intermediate', 'Expert']),
            category: z.string(),
            expertise: z.array(z.string()).max(10),
        }),
        availability: z.object({
            status: z.string(),
            details: z.string(),
        }),
        languages: z.array(
            z.object({
                name: z.string(),
                proficiency: z.enum(['Basic', 'Intermediate', 'Advanced']),
            })
        ).optional(),
    }),
});
