import { http } from '../../lib/http'
import type { AuthUser, LoginRequest, LoginResponse } from './types'

export async function login(payload: LoginRequest): Promise<LoginResponse> {
    const { data } = await http.post<LoginResponse>('/auth/login', payload)
    return data
}

export async function getMe(): Promise<AuthUser> {
    const { data } = await http.get<AuthUser>('/auth/me')
    return data
}
