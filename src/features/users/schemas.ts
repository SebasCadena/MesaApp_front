import { z } from 'zod'

export const createUserSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  cedula: z.string().min(5, 'La cedula debe tener al menos 5 caracteres'),
  correo: z.email('Debes ingresar un correo valido'),
  password: z.string().min(8, 'La contrasena debe tener al menos 8 caracteres'),
  tienda_id: z.number().int().positive('La tienda debe ser mayor a 0'),
})

export type CreateUserSchema = z.infer<typeof createUserSchema>

export const assignRolesSchema = z.object({
  userId: z.number().int().positive('Debes seleccionar un usuario'),
  tiendaId: z.number().int().positive('Debes indicar una tienda valida'),
  roles: z.array(z.string()).min(1, 'Debes seleccionar al menos un rol'),
})

export type AssignRolesSchema = z.infer<typeof assignRolesSchema>
