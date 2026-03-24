import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './home'
import LoginPage from './login'
import { ProtectedRoute } from './protected-route'
import UsersPage from './users'
import UserRolesPage from './user-roles'

export function AppRouter() {
    return (
        <Routes>
            <Route path='/login' element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
                <Route path='/home' element={<HomePage />} />
                <Route path='/users' element={<UsersPage />} />
                <Route path='/user-roles' element={<UserRolesPage />} />
            </Route>

            <Route path='*' element={<Navigate to='/home' replace />} />
        </Routes>
    )
}
