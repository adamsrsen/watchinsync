import {Component} from 'react'
import styles from './Player.module.scss'
import {Socket} from 'socket.io-client'
import axios from 'axios'
import _ from 'lodash'

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
  playbackState: PlaybackState
  playbackRate: number
  time: number
  date: number
  remote: boolean
  player: any

  constructor(props) {
    super(props)

    this.playbackState = PlaybackState.paused
    this.playbackRate = 1
    this.time = 0
    this.date = Date.now() / 1000
    this.remote = false
  }

  componentDidUpdate(prevProps) {
    if(!_.isEqual(this.props, prevProps)) {
      this.loadVideo()
    }
  }

  play() {}

  pause() {}

  seek(time) {
    this.remote = true
    this.time = time
    this.date = Date.now() / 1000
  }

  setPlaybackRate(playbackRate) {
    this.playbackRate = playbackRate
  }

  ended() {
    axios.post('/api/room/playlist/skip', {roomId: this.props.roomId, videoId: this.props.videoId, delay: 1000}).then(() => {}).catch((e) => {})
  }

  initSockets() {
    this.deinitSockets()

    this.props.socket.on('play', () => {
      this.playbackState = PlaybackState.playing
      this.play()
    })
    this.props.socket.on('pause', () => {
      this.playbackState = PlaybackState.paused
      this.pause()
    })
    this.props.socket.on('seek', (time) => {
      this.seek(time)
    })
    this.props.socket.on('playback_rate', (playbackRate) => {
      this.setPlaybackRate(playbackRate)
    })
  }

  deinitSockets() {
    this.props.socket.removeAllListeners('play')
    this.props.socket.removeAllListeners('pause')
    this.props.socket.removeAllListeners('seek')
    this.props.socket.removeAllListeners('playback_rate')
  }

  loadVideo() {}

  render() {
    return (
      <div className={styles.player}>
        <p>NO VIDEO</p>
      </div>
    )
  }
}