import { http } from '../../lib/http'
import type { AssignRolesRequest, CreateUserRequest, RoleItem, UserItem, UserRoleItem } from './types'

function normalizeUser(raw: unknown): UserItem {
  const value = (raw ?? {}) as Record<string, unknown>
  const nestedRoles = Array.isArray(value.usuario_roles)
    ? value.usuario_roles
        .map((row) => {
          const roleRow = (row ?? {}) as Record<string, unknown>
          const nestedRole = (roleRow.rol ?? {}) as Record<string, unknown>
          return String(roleRow.rol_nombre ?? nestedRole.nombre ?? '')
        })
        .filter((name) => Boolean(name))
    : []

  const directRoles = Array.isArray(value.roles) ? value.roles.map((role) => String(role)) : []
  const mergedRoles = directRoles.length > 0 ? directRoles : nestedRoles

  return {
    id: Number(value.id ?? 0),
    nombre: String(value.nombre ?? ''),
    cedula: String(value.cedula ?? ''),
    correo: String(value.correo ?? ''),
    tienda_id: Number(value.tienda_id ?? 0),
    activo: Boolean(value.activo),
    roles: mergedRoles,
  }
}

function normalizeRoles(raw: unknown): RoleItem[] {
  if (!Array.isArray(raw)) {
    return []
  }

  return raw.map((item, index) => {
    if (typeof item === 'string') {
      return {
        id: index + 1,
        nombre: item,
      }
    }

    const value = (item ?? {}) as Record<string, unknown>

    return {
      id: Number(value.id ?? index + 1),
      nombre: String(value.nombre ?? value.name ?? ''),
      descripcion: value.descripcion ? String(value.descripcion) : undefined,
    }
  })
}

function normalizeUserRoles(raw: unknown): UserRoleItem[] {
  if (!Array.isArray(raw)) {
    return []
  }

  return raw.map((item) => {
    const value = (item ?? {}) as Record<string, unknown>

    return {
      id: Number(value.id ?? 0),
      usuario_id: Number(value.usuario_id ?? 0),
      rol_id: Number(value.rol_id ?? 0),
      tienda_id: Number(value.tienda_id ?? 0),
      activo: Boolean(value.activo),
    }
  })
}

function normalizeUserList(raw: unknown): UserItem[] {
  if (Array.isArray(raw)) {
    return raw.map((user) => normalizeUser(user))
  }

  const value = (raw ?? {}) as Record<string, unknown>
  const list = Array.isArray(value.items)
    ? value.items
    : Array.isArray(value.results)
      ? value.results
      : Array.isArray(value.data)
        ? value.data
        : []

  return list.map((user) => normalizeUser(user))
}

function mergeUsersWithRoles(users: UserItem[], userRoles: UserRoleItem[], roles: RoleItem[]): UserItem[] {
  const roleNameById = new Map<number, string>()
  const roleRowsByUserId = new Map<number, UserRoleItem[]>()

  roles.forEach((role) => {
    roleNameById.set(role.id, role.nombre)
  })

  userRoles.forEach((row) => {
    const current = roleRowsByUserId.get(row.usuario_id) ?? []
    current.push(row)
    roleRowsByUserId.set(row.usuario_id, current)
  })

  return users.map((user) => {
    const rows = roleRowsByUserId.get(user.id) ?? []
    const roleNames = rows
      .map((row) => roleNameById.get(row.rol_id))
      .filter((name): name is string => Boolean(name))
    const firstStoreRow = rows.find((row) => row.activo) ?? rows[0]

    return {
      ...user,
      tienda_id: firstStoreRow?.tienda_id ?? user.tienda_id,
      roles: roleNames.length > 0 ? roleNames : user.roles ?? [],
    }
  })
}

export async function getUsers(): Promise<UserItem[]> {
  const [usersResponse, userRolesResponse, rolesResponse] = await Promise.all([
    http.get<unknown>('/usuarios'),
    http.get<unknown>('/usuarios-roles'),
    http.get<unknown>('/roles'),
  ])

  const users = normalizeUserList(usersResponse.data)
  const userRoles = normalizeUserRoles(userRolesResponse.data)
  const roles = normalizeRoles(rolesResponse.data)

  return mergeUsersWithRoles(users, userRoles, roles)
}

export async function createUser(payload: CreateUserRequest): Promise<UserItem> {
  const { data } = await http.post<unknown>('/usuarios', {
    nombre: payload.nombre,
    cedula: payload.cedula,
    correo: payload.correo,
    password_hash: payload.password,
    tienda_id: payload.tienda_id,
  })

  return normalizeUser(data)
}

export async function getRoles(): Promise<RoleItem[]> {
  const { data } = await http.get<unknown>('/roles')
  return normalizeRoles(data)
}

export async function assignUserRoles(userId: number, payload: AssignRolesRequest): Promise<UserItem> {
  await Promise.all(
    payload.role_ids.map((roleId) =>
      http.post('/usuarios-roles', {
        usuario_id: userId,
        rol_id: roleId,
        tienda_id: payload.tienda_id,
      }),
    ),
  )

  const users = await getUsers()
  return users.find((user) => user.id === userId) ?? normalizeUser(null)
}
