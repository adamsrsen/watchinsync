import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp} from 'typeorm'
import Users from './Users'
import Rooms from './Rooms'

@Entity()
export default class Messages {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  text: string

  @Column({type: 'timestamp'})
  timestamp: Timestamp

  @ManyToOne(() => Users)
  user: Partial<Users>

  @ManyToOne(() => Rooms, (room) => room.messages)
  room: Partial<Rooms>
}