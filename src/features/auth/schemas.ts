import { z } from 'zod'

export const loginSchema = z.object({
    cedula: z.string().min(1, 'La cedula es obligatoria'),
    password: z.string().min(1, 'La contrasena es obligatoria'),
})

export type LoginSchema = z.infer<typeof loginSchema>
