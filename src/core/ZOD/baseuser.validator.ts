// src/validators/user.validator.ts

import { z } from 'zod';

export const baseUserZod = z.object({
    name:z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(['agency', 'agent', 'admin']),
});


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
