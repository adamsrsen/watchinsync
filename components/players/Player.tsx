import {Component} from 'react'
import styles from './Player.module.scss'
import {Socket} from 'socket.io-client'

interface Props {
  roomId: number
  videoId: number
  link: string
  socket: Socket
}


export enum PlaybackState {
  playing,
  paused,
}

export default class Player extends Component<Props> {
  render() {
    return (
      <div className={styles.player}>
        <p>NO VIDEO</p>
      </div>
    )
  }
}