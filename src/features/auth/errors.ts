import axios from 'axios'
import type { AuthErrorResponse } from './types'

export function getAuthErrorMessage(error: unknown): string {
    if (axios.isAxiosError<AuthErrorResponse>(error)) {
        return error.response?.data?.detail ?? error.response?.data?.message ?? 'No se pudo iniciar sesion'
    }

    return 'No se pudo iniciar sesion'
}
