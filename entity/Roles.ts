import {Column, Entity, ManyToOne} from 'typeorm'
import Users from './Users'
import Rooms from './Rooms'

export enum UserRole {
  OWNER,
  ADMIN,
  MODERATOR,
  MEMBER
}

@Entity()
export default class Roles {
  @ManyToOne(() => Users, (user) => user.joined_rooms, {primary: true})
  user: Partial<Users>

  @ManyToOne(() => Rooms, (room) => room.roles, {primary: true})
  room: Partial<Rooms>

  @Column({type: 'enum', enum: UserRole, default: UserRole.MEMBER})
  role: UserRole
}