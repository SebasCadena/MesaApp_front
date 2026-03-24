export interface UserItem {
    id: number
    nombre: string
    cedula: string
    correo: string
    tienda_id: number | null
    activo: boolean
    roles?: string[]
}

export interface CreateUserRequest {
    nombre: string
    cedula: string
    celular?: string
    correo: string
    password: string
    direccion?: string
    fecha_nacimiento?: string
}

export interface RoleItem {
    id: number
    nombre: string
    descripcion?: string
}

export interface UserRoleItem {
    id: number
    usuario_id: number
    rol_id: number
    tienda_id: number
    activo: boolean
}

export interface AssignRolesRequest {
    role_ids: number[]
    tienda_id: number
}
