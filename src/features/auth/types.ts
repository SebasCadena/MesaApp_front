export interface AuthUser {
    id: number
    nombre: string
    cedula: string
    correo: string
    tienda_id: number
    is_superadmin: boolean
    roles: string[]
    permisos: string[]
}

export interface LoginRequest {
    cedula: string
    password: string
}

export interface LoginResponse {
    access_token: string
    refresh_token: string
    token_type: string
    expires_in: number
    user: AuthUser
}

export interface AuthErrorResponse {
    detail?: string
    message?: string
}
