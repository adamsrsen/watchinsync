import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import Player, {PlaybackState} from './Player'
import {createRef, RefObject} from 'react'

export default class VideoJS extends Player {
  videoRef: RefObject<any>

  constructor(props) {
    super(props)

    this.videoRef = createRef()
  }

  componentDidMount() {
    this.loadVideo()
  }

  async play() {
    await this.player.play()
  }

  pause() {
    this.player.pause()
  }

  seek(time) {
    super.seek(time)
    this.player.currentTime(time)
  }

  loadVideo() {
    if(this.player){
      this.player.load()
    }
    else {
      this.player = videojs(this.videoRef.current, {
        fluid: true
      }, () => {
        this.player.volume(window.localStorage.getItem('volume'))
      })

      // Save current volume and set it in future VideoJS players
      this.player.on('volumechange', () => {
        window.localStorage.setItem('volume', this.player.volume())
      })
      // Listen to play event and send socket if it was user input
      this.player.on('play', () => {
        if (this.playbackState !== PlaybackState.playing) {
          this.props.socket.emit('play', this.player.currentTime())
          this.pause()
        }
      })
      // Listen to pause event and send socket if it was user input
      this.player.on('pause', async () => {
        if (this.playbackState !== PlaybackState.paused) {
          if(Math.abs(this.player.bufferedEnd() - this.player.currentTime()) < 1) {
            this.props.socket.emit('buffer')
            this.pause()
            this.playbackState = PlaybackState.buffering
          }
          else {
            this.props.socket.emit('pause', this.player.currentTime())
            await this.play()
          }
        }
      })
      // Listen to seek event and send socket if it was user input
      this.player.on('seeking', () => {
        if (!this.remote) {
          this.props.socket.emit('seek', this.player.currentTime())
        }
        this.remote = false
      })
      // Listen to end event and play next
      this.player.on('ended', () => {
        this.ended()
      })
      this.player.on('progress', () => {
        if (this.playbackState === PlaybackState.buffering && this.player.bufferedEnd() - this.player.currentTime() > 10) {
          this.props.socket.emit('ready')
          this.playbackState = PlaybackState.paused
        }
      })

      this.initSockets()
    }
  }

  componentWillUnmount() {
    this.deinitSockets()
  }

  render() {
    return (
      <div data-vjs-player>
        <video ref={this.videoRef} className="video-js vjs-big-play-centered" controls={true} preload="auto">
          <source src={this.props.link}/>
        </video>
      </div>
    )
  }
}