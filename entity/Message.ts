import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp} from 'typeorm'
import User from './User'
import Room from './Room'

@Entity()
export default class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  text: string

  @Column({type: 'timestamp'})
  timestamp: Timestamp

  @ManyToOne(() => User)
  user: User

  @ManyToOne(() => Room, (room) => room.messages)
  room: Room
}