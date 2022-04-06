import Player, {PlaybackState} from './Player'
import styles from './YouTube.module.scss'

export default class Youtube extends Player {
  player: any
  remote: boolean
  playbackState: PlaybackState
  time: number
  date: number

  constructor(props) {
    super(props)

    this.remote = false
    this.playbackState = PlaybackState.paused
    this.time = 0
    this.date = Date.now() / 1000
  }

  componentDidMount() {
    // @ts-ignore
    if(!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'

      // @ts-ignore
      window.onYouTubeIframeAPIReady = this.loadVideo.bind(this)

      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    } else {
      this.loadVideo()
    }
  }

  play() {
    this.player.playVideo()
  }

  pause() {
    this.player.pauseVideo()
  }

  seek(time) {
    this.remote = true
    this.time = time
    this.date = Date.now() / 1000
    this.player.seekTo(time)
    this.remote = false
  }

  loadVideo() {
    // @ts-ignore
    this.player = new window.YT.Player('yt-player', {
      videoId: this.props.link,
      events: {
        'onStateChange': (e) => {
          switch(e.data) {
            // @ts-ignore
            case window.YT.PlayerState.PLAYING:
              if(this.playbackState === PlaybackState.paused) {
                this.props.socket.emit('play', this.player.getCurrentTime())
                setTimeout(() => {
                  if(this.playbackState === PlaybackState.paused) {
                    this.pause()
                  }
                }, 100)
              }
              break
            // @ts-ignore
            case window.YT.PlayerState.PAUSED:
              if(this.playbackState === PlaybackState.playing) {
                this.props.socket.emit('pause', this.player.getCurrentTime())
                setTimeout(() => {
                  if(this.playbackState === PlaybackState.playing) {
                    this.play()
                  }
                }, 100)
              }
              break
          }
          // @ts-ignore
          if(Math.abs(this.player.getCurrentTime() + this.date - this.time - Date.now() / 1000) > 2 && !this.remote) {
            this.props.socket.emit('seek', this.player.getCurrentTime())
          }
        }
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
    this?.player?.destroy()

    this.props.socket.removeAllListeners('play')
    this.props.socket.removeAllListeners('pause')
    this.props.socket.removeAllListeners('seek')
  }

  render() {
    return (
      <div id="yt-player" className={styles.player} />
    )
  }
}