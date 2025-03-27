import { z } from 'zod';

// zod is a validation library for JavaScript that allows you to define a schema for your data and then validate it against that schema.

export const userSignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3).max(16)
});

export const userSignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});