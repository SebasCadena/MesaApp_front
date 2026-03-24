import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './home'
import LoginPage from './login'
import { ProtectedRoute } from './protected-route'

export function AppRouter() {
    return (
        <Routes>
            <Route path='/login' element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
                <Route path='/home' element={<HomePage />} />
            </Route>

            <Route path='*' element={<Navigate to='/home' replace />} />
        </Routes>
    )
}
