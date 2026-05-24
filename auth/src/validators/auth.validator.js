const {z} = require('zod');

const registerSchema = z.object({
    name: z.string().min(3).max(100).describe('Name must be between 3 and 100 characters'),
    email: z.string().email().describe('Invalid email address'),
    password: z.string().min(6).max(100).describe('Password must be between 6 and 100 characters').optional(),
    role: z.enum(['user', 'artist', 'admin']).describe('Role must be either user, artist, or admin'),
    googleId: z.string().optional(),
    provider: z.enum(['local', 'google']).default('local').describe('Provider must be either local or google'),
    otp: z.string().optional()
});
const loginSchema = z.object({
    email: z.string().email().describe('Invalid email address'),
    password: z.string().min(6).max(100).describe('Password must be between 6 and 100 characters').optional(),
    provider: z.enum(['local', 'google']).default('local').describe('Provider must be either local or google'),
    googleId: z.string().optional()
});
const updateProfileSchema = z.object({
    name: z.string().min(3).max(100).describe('Name must be between 3 and 100 characters').optional(),
    email: z.string().email().describe('Invalid email address').optional(),
    password: z.string().min(6).max(100).describe('Password must be between 6 and 100 characters').optional(),
    role: z.enum(['user', 'artist', 'admin']).describe('Role must be either user, artist, or admin').optional(),
});
module.exports = {
    registerSchema,
    loginSchema,
    updateProfileSchema
};