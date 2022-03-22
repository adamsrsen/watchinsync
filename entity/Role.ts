import {BaseEntity, Column, Entity, ManyToOne, PrimaryColumn} from 'typeorm'
import User from './User'
import Room from './Room'

export enum UserRole {
  ADMIN,
  MODERATOR,
  MEMBER
}

@Entity()
export default class Role extends BaseEntity {
  @ManyToOne(() => User, (user) => user.joined_rooms, {primary: true})
  user: User

  @ManyToOne(() => Room, (room) => room.roles, {primary: true})
  room: Room

  @Column({type: 'enum', enum: UserRole, default: UserRole.MEMBER})
  role: UserRole
}