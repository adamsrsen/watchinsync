import Player, {PlaybackState} from './Player'
import styles from './Vimeo.module.scss'

export default class Vimeo extends Player {
  player: any
  remote: boolean
  playbackState: PlaybackState

  constructor(props) {
    super(props)

    this.remote = false
    this.playbackState = PlaybackState.paused
  }

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
    console.log('auto play', this.remote)
  }

  async pause() {
    await this.player.pause()
    console.log('auto pause', this.remote)
  }

  async seek(time) {
    this.remote = true
    await this.player.setCurrentTime(time)
    this.remote = false
  }

  loadVideo() {
    // @ts-ignore
    this.player = new window.Vimeo.Player('vimeo-player', {
      id: this.props.link,
      responsive: true,
      autoPause: false
    })

    this.player.on('play', (data) => {
      console.log('play', this.remote)
      if(this.playbackState === PlaybackState.paused) {
        this.props.socket.emit('play', data?.seconds)
        setTimeout(async () => {
          if(this.playbackState === PlaybackState.paused) {
            await this.pause()
          }
        }, 100)
      }
    })
    this.player.on('pause', (data) => {
      console.log('pause', this.remote)
      if(this.playbackState === PlaybackState.playing) {
        this.props.socket.emit('pause', data?.seconds)
        setTimeout(async () => {
          if(this.playbackState === PlaybackState.playing) {
            await this.play()
          }
        }, 100)
      }
    })
    this.player.on('seeked', (data) => {
      console.log(data)
      if(!this.remote) {
        this.props.socket.emit('seek', data?.seconds)
      }
    })

    this.props.socket.on('play', async () => {
      this.playbackState = PlaybackState.playing
      await this.play()
    })
    this.props.socket.on('pause', async () => {
      this.playbackState = PlaybackState.paused
      await this.pause()
    })
    this.props.socket.on('seek', async (time) => {
      await this.seek(time)
    })
  }

  componentWillUnmount() {
    this?.player?.destroy()

    this.props.socket.removeAllListeners('play')
    this.props.socket.removeAllListeners('pause')
    this.props.socket.removeAllListeners('seek')
  }

  render() {
    return (
      <div id="vimeo-player" className={styles.player} />
    )
  }
}