import {BaseEntity, Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn} from 'typeorm'
import Users from './Users'
import Roles from './Roles'
import Permissions from './Permissions'
import Videos from './Videos'
import Messages from './Messages'

@Entity()
export default class Rooms extends BaseEntity {
  @PrimaryColumn({type: 'uuid'})
  id: string

  @Column()
  name: string

  @ManyToOne(() => Users, (user) => user.id)
  owner: Partial<Users>

  @OneToMany(() => Roles, (role) => role.room)
  roles: Partial<Roles[]>

  @OneToOne(() => Permissions)
  admin_permissions: Partial<Permissions>

  @OneToOne(() => Permissions)
  moderator_permissions: Partial<Permissions>

  @OneToOne(() => Permissions)
  member_permissions: Partial<Permissions>

  @OneToMany(() => Videos, (video) => video.room)
  videos: Partial<Videos[]>

  @OneToMany(() => Messages, (message) => message.room)
  messages: Partial<Messages[]>
}