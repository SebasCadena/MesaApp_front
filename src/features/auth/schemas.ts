import { z } from 'zod'

export const loginSchema = z.object({
    cedula: z.string().min(3, 'La cedula debe tener al menos 3 caracteres'),
    password: z.string().min(8, 'La contrasena debe tener al menos 8 caracteres'),
})

export type LoginSchema = z.infer<typeof loginSchema>
