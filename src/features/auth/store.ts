import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { clearAccessToken, saveAccessToken } from './storage'
import type { AuthUser, LoginResponse } from './types'

interface AuthState {
    accessToken: string | null
    refreshToken: string | null
    tokenType: string | null
    expiresIn: number | null
    user: AuthUser | null
    isAuthenticated: boolean
    setSession: (session: LoginResponse) => void
    setUser: (user: AuthUser) => void
    logout: () => void
}

const initialState = {
    accessToken: null,
    refreshToken: null,
    tokenType: null,
    expiresIn: null,
    user: null,
    isAuthenticated: false,
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            ...initialState,
            setSession: (session) => {
                saveAccessToken(session.access_token)

                set({
                    accessToken: session.access_token,
                    refreshToken: session.refresh_token,
                    tokenType: session.token_type,
                    expiresIn: session.expires_in,
                    user: session.user,
                    isAuthenticated: true,
                })
            },
            setUser: (user) => set({ user }),
            logout: () => {
                clearAccessToken()
                set(initialState)
            },
        }),
        {
            name: 'mesaapp-auth',
            partialize: (state) => ({
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                tokenType: state.tokenType,
                expiresIn: state.expiresIn,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
            onRehydrateStorage: () => (state) => {
                if (state?.accessToken) {
                    saveAccessToken(state.accessToken)

                    if (!state.isAuthenticated) {
                        state.isAuthenticated = true
                    }
                }
            },
        },
    ),
)
