import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../features/auth/api'
import { useAuthStore } from '../../features/auth/store'

export default function HomePage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const logout = useAuthStore((state) => state.logout)

  const meQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getMe,
    retry: false,
  })

  useEffect(() => {
    if (meQuery.data) {
      setUser(meQuery.data)
    }
  }, [meQuery.data, setUser])

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <main className='page-center'>
      <section className='card'>
        <header className='card-header'>
          <h1>Home</h1>
          <p>Sesion autenticada correctamente.</p>
        </header>

        {meQuery.isFetching && <p>Cargando perfil...</p>}

        {user && (
          <div className='summary'>
            <p>
              <strong>Nombre:</strong> {user.nombre}
            </p>
            <p>
              <strong>Cedula:</strong> {user.cedula}
            </p>
            <p>
              <strong>Correo:</strong> {user.correo}
            </p>
            <p>
              <strong>Roles:</strong> {user.roles.join(', ') || 'Sin roles'}
            </p>
          </div>
        )}

        {meQuery.isError && <p className='error-message'>No se pudo cargar /auth/me, revisa el token o permisos.</p>}

        <button onClick={handleLogout}>Cerrar sesion</button>
      </section>
    </main>
  )
}
