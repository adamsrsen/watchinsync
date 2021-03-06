import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import Users from './Users'
import Rooms from './Rooms'

export enum VideoType {
  YOUTUBE = 'youtube',
  VIMEO = 'vimeo',
  TWITCH = 'twitch',
  FACEBOOK = 'facebook',
  DIRECT = 'direct'
}

@Entity()
export default class Videos {
  @PrimaryGeneratedColumn()
  id: number

  @Column({type: 'enum', enum: VideoType})
  type: VideoType

  @Column()
  link: string

  @Column()
  name: string

  @Column({type: 'integer'})
  position: number

  @Column()
  played: boolean

  @ManyToOne(() => Users)
  user: Partial<Users>

  @ManyToOne(() => Rooms, (room) => room.videos, {onDelete: 'CASCADE'})
  room: Partial<Rooms>
}