import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url().default('http://localhost:8080'),
  INTERNAL_API_BASE_URL: z.string().url().optional(),
});

// In Next.js, process.env.NEXT_PUBLIC_* variables are replaced at build time.
// We need to explicitly access them.
const processEnv = {
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  INTERNAL_API_BASE_URL: process.env.INTERNAL_API_BASE_URL,
};

const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
  console.error(
    '❌ Invalid environment variables:',
    parsed.error.flatten().fieldErrors
  );
  throw new Error('Invalid environment variables');
}

export const config = parsed.data;
