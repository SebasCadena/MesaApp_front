import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { assignUserRoles, getRoles, getUsers } from '../../features/users/api'
import { assignRolesSchema, type AssignRolesSchema } from '../../features/users/schemas'

export default function UserRolesPage() {
  const queryClient = useQueryClient()

  const usersQuery = useQuery({
    queryKey: ['usuarios'],
    queryFn: getUsers,
  })

  const rolesQuery = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignRolesSchema>({
    resolver: zodResolver(assignRolesSchema),
    defaultValues: {
      userId: 0,
      tiendaId: 1,
      roles: [],
    },
  })

  const assignRolesMutation = useMutation({
    mutationFn: (values: AssignRolesSchema) =>
      assignUserRoles(values.userId, {
        role_ids: values.roles.map((roleId) => Number(roleId)).filter((roleId) => Number.isFinite(roleId)),
        tienda_id: values.tiendaId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    },
  })

  const onSubmit = (values: AssignRolesSchema) => {
    assignRolesMutation.mutate(values)
  }

  return (
    <main className='page-shell'>
      <section className='panel'>
        <header>
          <h1>Asignacion de Roles</h1>
          <p>Ejemplo de flujo para relacion usuario a roles.</p>
        </header>

        <form className='grid-form' onSubmit={handleSubmit(onSubmit)}>
          <input placeholder='Tienda ID' type='number' {...register('tiendaId', { valueAsNumber: true })} />

          <select {...register('userId', { valueAsNumber: true })}>
            <option value={0}>Selecciona un usuario</option>
            {usersQuery.data?.map((user) => (
              <option value={user.id} key={user.id}>
                {user.nombre} ({user.cedula})
              </option>
            ))}
          </select>

          <fieldset className='checkbox-block'>
            <legend>Roles</legend>
            {rolesQuery.data?.map((role) => (
              <label key={role.id}>
                <input type='checkbox' value={String(role.id)} {...register('roles')} />
                {role.nombre}
              </label>
            ))}
          </fieldset>

          <button type='submit' disabled={assignRolesMutation.isPending}>
            {assignRolesMutation.isPending ? 'Asignando...' : 'Guardar roles'}
          </button>
        </form>

        <div className='field-errors'>
          {errors.tiendaId && <small>{errors.tiendaId.message}</small>}
          {errors.userId && <small>{errors.userId.message}</small>}
          {errors.roles && <small>{errors.roles.message}</small>}
        </div>

        {assignRolesMutation.isError && <p className='error-message'>No se pudieron asignar roles.</p>}

        {usersQuery.isLoading && <p>Cargando usuarios...</p>}
        {rolesQuery.isLoading && <p>Cargando roles...</p>}
      </section>
    </main>
  )
}
