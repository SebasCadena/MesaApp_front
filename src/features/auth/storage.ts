const ACCESS_TOKEN_KEY = 'mesaapp_access_token'

export function saveAccessToken(token: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function clearAccessToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
}
