import axios from 'axios'
import { env } from '../config/env'
import { getAccessToken } from '../features/auth/storage'

export const http = axios.create({
    baseURL: env.apiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
})

http.interceptors.request.use((config) => {
    const token = getAccessToken()

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})
