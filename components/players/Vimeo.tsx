import Player, {PlaybackState} from './Player'
import styles from './Vimeo.module.scss'

export default class Vimeo extends Player {
  componentDidMount() {
    // @ts-ignore
    if(!window.Vimeo) {
      const tag = document.createElement('script')
      tag.src = 'https://player.vimeo.com/api/player.js'

      tag.addEventListener('load', () => this.loadVideo())

      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    } else {
      this.loadVideo()
    }
  }

  async play() {
    await this.player.play()
  }

  async pause() {
    await this.player.pause()
  }

  async seek(time) {
    super.seek(time)
    await this.player.setCurrentTime(time)
  }

  async setPlaybackRate(playbackRate) {
    super.setPlaybackRate(playbackRate)
    await this.player.setPlaybackRate(playbackRate)
  }

  loadVideo() {
    if(this.player){
      this.player.destroy()
    }

    // @ts-ignore
    this.player = new window.Vimeo.Player('vimeo-player', {
      id: this.props.link,
      responsive: true
    })

    // Listen to play event and send socket if it was user input
    this.player.on('play', (data) => {
      if(this.playbackState !== PlaybackState.playing) {
        this.props.socket.emit('play', data?.seconds)
        setTimeout(async () => {
          if(this.playbackState === PlaybackState.paused) {
            await this.pause()
          }
        }, 100)
      }
    })
    // Listen to pause event and send socket if it was user input
    this.player.on('pause', (data) => {
      if(this.playbackState !== PlaybackState.paused) {
        this.props.socket.emit('pause', data?.seconds)
        setTimeout(async () => {
          if(this.playbackState === PlaybackState.playing) {
            await this.play()
          }
        }, 100)
      }
    })
    // Listen to seek event and send socket if it was user input
    this.player.on('seeked', (data) => {
      if(!this.remote) {
        this.props.socket.emit('seek', data?.seconds)
      }
      this.remote = false
    })
    // Listen to playback rate event and send socket if it was user input
    this.player.on('playbackratechange', ({playbackRate}) => {
      if(playbackRate !== this.playbackRate) {
        this.props.socket.emit('playback_rate', playbackRate)
      }
    })
    this.player.on('bufferstart', async () => {
      this.props.socket.emit('buffer')
      await this.pause()
      this.playbackState = PlaybackState.buffering
    })
    this.player.on('bufferend', () => {
      this.props.socket.emit('ready')
      this.playbackState = PlaybackState.paused
    })
    // Listen to end event and play next
    this.player.on('ended', () => {
      this.ended()
    })

    this.initSockets()
  }

  componentWillUnmount() {
    this?.player?.destroy()

    this.deinitSockets()
  }

  render() {
    return (
      <div id="vimeo-player" className={styles.player} />
    )
  }
}