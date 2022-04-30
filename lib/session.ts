import type { IronSessionOptions } from 'iron-session'
import type User from '../objects/User'
import getConnection from './db'
import Roles from '../entity/Roles'
import {UserRole} from '../objects/UserRole'
import Rooms from '../entity/Rooms'

export const sessionOptions: IronSessionOptions = {
  password: process.env.COOKIE_SECRET,
  cookieName: 'session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}

declare module 'iron-session' {
  interface IronSessionData {
    user?: User
  }
}

export const verifyPermission = async (roomId, userId, permission) => {
  const connection = await getConnection()

  const role = await connection
    .getRepository<Roles>('Roles')
    .createQueryBuilder('role')
    .where('role.room.id = :roomId AND role.user.id = :userId', {roomId, userId})
    .getOne()
  if(!role) {
    return false
  }

  if(role.role === UserRole.OWNER){
    return true
  }

  let rolesPermissions
  switch (role.role) {
    case UserRole.ADMIN:
      rolesPermissions = 'admin_permissions'
      break
    case UserRole.MODERATOR:
      rolesPermissions = 'moderator_permissions'
      break
    case UserRole.MEMBER:
      rolesPermissions = 'member_permissions'
      break
  }

  const permissions = await connection
    .getRepository<Rooms>('Rooms')
    .createQueryBuilder('room')
    .innerJoinAndSelect(`room.${rolesPermissions}`, 'permissions')
    .where('room.id = :roomId', {roomId})
    .getOne()

  return permissions[rolesPermissions][permission]
}