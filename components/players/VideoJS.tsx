import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import Player, {PlaybackState} from './Player'
import {createRef, RefObject} from 'react'
import {getCookie} from '../../lib/util'

export default class VideoJS extends Player {
  videoRef: RefObject<any>
  remote: boolean
  playbackState: PlaybackState
  player: any
  
  constructor(props) {
    super(props)

    this.videoRef = createRef()
    this.remote = false
    this.playbackState = PlaybackState.paused
  }

  play() {
    this.player.play()
  }

  pause() {
    this.player.pause()
  }

  seek(time) {
    this.remote = true
    this.player.currentTime(time)
    this.remote = false
  }

  async componentDidMount() {
    this.player = videojs(this.videoRef.current, {
      fluid: true
    }, () => {
      this.player.volume(getCookie('volume'))
    })

    this.player.on('volumechange', () => {
      document.cookie = `volume=${this.player.volume()}; max-age=${365*24*60*60}; path=/`
    })
    this.player.on('play', () => {
      if(this.playbackState === PlaybackState.paused) {
        this.props.socket.emit('play', this.player.currentTime())
        this.pause()
      }
    })
    this.player.on('pause', () => {
      if(this.playbackState === PlaybackState.playing) {
        this.props.socket.emit('pause', this.player.currentTime())
        this.play()
      }
    })
    this.player.on('seeking', () => {
      if(!this.remote) {
        this.props.socket.emit('seek', this.player.currentTime())
      }
    })

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
  }

  componentWillUnmount() {
    this.props.socket.removeAllListeners('play')
    this.props.socket.removeAllListeners('pause')
    this.props.socket.removeAllListeners('seek')
  }

  render() {
    return (
      <div data-vjs-player>
        <video ref={this.videoRef} className="video-js vjs-big-play-centered" controls={true}>
          <source src={this.props.link}/>
        </video>
      </div>
    )
  }
}