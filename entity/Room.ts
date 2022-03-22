import {BaseEntity, Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn} from 'typeorm'
import User from './User'
import Role from './Role'
import Permission from './Permission'
import Video from './Video'
import Message from './Message'

@Entity()
export default class Room extends BaseEntity {
  @PrimaryColumn({type: 'uuid'})
  id: string

  @Column()
  name: string

  @ManyToOne(() => User, (user) => user.id)
  owner: User

  @OneToMany(() => Role, (role) => role.room)
  roles: Role[]

  @OneToOne(() => Permission)
  admin_permissions: Permission

  @OneToOne(() => Permission)
  moderator_permissions: Permission

  @OneToOne(() => Permission)
  member_permissions: Permission

  @OneToMany(() => Video, (video) => video.room)
  videos: Video[]

  @OneToMany(() => Message, (message) => message.room)
  messages: Message[]
}