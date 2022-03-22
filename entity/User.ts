import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import Role from './Role'

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({unique: true})
  username: string

  @Column({unique: true})
  email: string

  @Column()
  password: string

  @OneToMany(() => Role, (role) => role.user)
  joined_rooms: Role[]
}