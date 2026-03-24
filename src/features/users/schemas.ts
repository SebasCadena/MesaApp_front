import { z } from 'zod'

export const createUserSchema = z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    cedula: z.string().min(5, 'La cedula debe tener al menos 5 caracteres'),
    celular: z.string().max(30, 'Celular muy largo').optional(),
    correo: z.email('Debes ingresar un correo valido'),
    password: z.string().min(8, 'La contrasena debe tener al menos 8 caracteres'),
    direccion: z.string().max(255, 'Direccion muy larga').optional(),
    fecha_nacimiento: z.string().optional(),
})

export type CreateUserSchema = z.infer<typeof createUserSchema>

export const assignRolesSchema = z.object({
    userId: z.number().int().positive('Debes seleccionar un usuario'),
    tiendaId: z.number().int().positive('Debes indicar una tienda valida'),
    roles: z.array(z.string()).min(1, 'Debes seleccionar al menos un rol'),
})

export type AssignRolesSchema = z.infer<typeof assignRolesSchema>
