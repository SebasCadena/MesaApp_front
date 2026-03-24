import axios from 'axios'
import type { AuthErrorResponse } from './types'

function parseFastApiDetail(detail: unknown): string | null {
    if (!detail) {
        return null
    }

    if (typeof detail === 'string') {
        return detail
    }

    if (Array.isArray(detail)) {
        const messages = detail
            .map((item) => {
                const value = (item ?? {}) as Record<string, unknown>
                return typeof value.msg === 'string' ? value.msg : null
            })
            .filter((msg): msg is string => Boolean(msg))

        return messages.length > 0 ? messages.join('. ') : null
    }

    return null
}

export function getAuthErrorMessage(error: unknown): string {
    if (axios.isAxiosError<AuthErrorResponse>(error)) {
        const detailMessage = parseFastApiDetail(error.response?.data?.detail)

        if (detailMessage) {
            return detailMessage
        }

        if (error.response?.data?.message) {
            return error.response.data.message
        }

        return 'No se pudo iniciar sesion'
    }

    return 'No se pudo iniciar sesion'
}
