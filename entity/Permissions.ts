import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export default class Permissions {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  play_pause: boolean

  @Column()
  seek: boolean

  @Column()
  playback_speed: boolean

  @Column()
  add_video: boolean

  @Column()
  skip_video: boolean

  @Column()
  remove_video: boolean

  @Column()
  chat: boolean

  @Column()
  video_chat: boolean

  @Column()
  change_role: boolean
}