import {Column, Entity, ManyToOne} from 'typeorm'
import Users from './Users'
import Rooms from './Rooms'
import {UserRole} from '../objects/UserRole'

@Entity()
export default class Roles {
  @ManyToOne(() => Users, (user) => user.joined_rooms, {primary: true, onDelete: 'CASCADE'})
  user: Partial<Users>

  @ManyToOne(() => Rooms, (room) => room.roles, {primary: true, onDelete: 'CASCADE'})
  room: Partial<Rooms>

  @Column({type: 'enum', enum: UserRole, default: UserRole.MEMBER})
  role: UserRole
}