import { Navigate, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { login } from '../../features/auth/api'
import { getAuthErrorMessage } from '../../features/auth/errors'
import { loginSchema, type LoginSchema } from '../../features/auth/schemas'
import { useAuthStore } from '../../features/auth/store'

export default function LoginPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const setSession = useAuthStore((state) => state.setSession)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      cedula: '',
      password: '',
    },
  })

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (session) => {
      setSession(session)
      navigate('/home', { replace: true })
    },
  })

  const onSubmit = (values: LoginSchema) => {
    loginMutation.mutate({
      ...values,
      cedula: values.cedula.trim(),
    })
  }

  if (isAuthenticated) {
    return <Navigate to='/home' replace />
  }

  const errorMessage = loginMutation.isError ? getAuthErrorMessage(loginMutation.error) : null

  return (
    <main className='page-center'>
      <section className='card'>
        <header className='card-header'>
          <h1>Iniciar sesion</h1>
          <p>Ingresa con tu cedula y contrasena para acceder a MesaApp.</p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className='form'>
          <label className='field'>
            <span>Cedula</span>
            <input type='text' autoComplete='username' {...register('cedula')} />
            {errors.cedula && <small>{errors.cedula.message}</small>}
          </label>

          <label className='field'>
            <span>Contrasena</span>
            <input type='password' autoComplete='current-password' {...register('password')} />
            {errors.password && <small>{errors.password.message}</small>}
          </label>

          {errorMessage && <p className='error-message'>{errorMessage}</p>}

          <button type='submit' disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </section>
    </main>
  )
}
