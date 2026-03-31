import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { createUser, getUsers } from '../../features/users/api'
import { createUserSchema, type CreateUserSchema } from '../../features/users/schemas'

export default function UsersPage() {
  const queryClient = useQueryClient()

  const usersQuery = useQuery({
    queryKey: ['usuarios'],
    queryFn: getUsers,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      nombre: '',
      cedula: '',
      correo: '',
      password: '',
      tienda_id: 1,
    },
  })

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    },
  })

  const onSubmit = (values: CreateUserSchema) => {
    createUserMutation.mutate(values)
  }

  return (
    <main className='page-shell'>
      <section className='panel'>
        <header>
          <h1>Usuarios</h1>
          <p>Ejemplo completo: listado + creacion con React Hook Form, Zod y TanStack Query.</p>
          <p>Nota: los roles pueden venir desde la relacion usuario_rol, no necesariamente embebidos en /usuarios.</p>
        </header>

        <form className='grid-form' onSubmit={handleSubmit(onSubmit)}>
          <input placeholder='Nombre' {...register('nombre')} />
          <input placeholder='Cedula' {...register('cedula')} />
          <input placeholder='Correo' type='email' {...register('correo')} />
          <input placeholder='Contrasena temporal' type='password' {...register('password')} />
          <input placeholder='Tienda ID' type='number' {...register('tienda_id', { valueAsNumber: true })} />
          <button type='submit' disabled={createUserMutation.isPending}>
            {createUserMutation.isPending ? 'Creando...' : 'Crear usuario'}
          </button>
        </form>

        <div className='field-errors'>
          {errors.nombre && <small>{errors.nombre.message}</small>}
          {errors.cedula && <small>{errors.cedula.message}</small>}
          {errors.correo && <small>{errors.correo.message}</small>}
          {errors.password && <small>{errors.password.message}</small>}
          {errors.tienda_id && <small>{errors.tienda_id.message}</small>}
        </div>

        {createUserMutation.isError && <p className='error-message'>No se pudo crear el usuario.</p>}

        {usersQuery.isLoading && <p>Cargando usuarios...</p>}
        {usersQuery.isError && <p className='error-message'>No se pudo consultar /usuarios.</p>}

        {usersQuery.data && (
          <div className='table-wrap'>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Cedula</th>
                  <th>Correo</th>
                  <th>Tienda</th>
                  <th>Activo</th>
                  <th>Roles</th>
                </tr>
              </thead>
              <tbody>
                {usersQuery.data.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.nombre}</td>
                    <td>{user.cedula}</td>
                    <td>{user.correo}</td>
                    <td>{user.tienda_id}</td>
                    <td>{user.activo ? 'Si' : 'No'}</td>
                    <td>{user.roles && user.roles.length > 0 ? user.roles.join(', ') : 'Sin roles'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}
