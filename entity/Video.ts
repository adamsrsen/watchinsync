import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import User from './User'
import Room from './Room'

export enum VideoType {
  YOUTUBE = 'youtube',
  VIMEO = 'vimeo',
  TWITCH = 'twitch',
  FACEBOOK = 'facebook',
  DIRECT = 'direct'
}

@Entity()
export default class Video extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({type: 'enum', enum: VideoType})
  type: VideoType

  @Column()
  link: string

  @Column({type: 'integer'})
  position: number

  @Column()
  played: boolean

  @ManyToOne(() => User)
  user: User

  @ManyToOne(() => Room, (room) => room.videos)
  room: Room
}