import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import Roles from './Roles'

@Entity()
export default class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({unique: true})
  username: string

  @Column({unique: true})
  email: string

  @Column()
  password: string

  @OneToMany(() => Roles, (role) => role.user)
  joined_rooms: Partial<Roles[]>
}