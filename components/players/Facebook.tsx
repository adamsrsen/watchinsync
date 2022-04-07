import Player, {PlaybackState} from './Player'

export default class Facebook extends Player {
  player: any
  remote: boolean
  playbackState: PlaybackState
  interval: any
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
    if(!window.FB) {
      const tag = document.createElement('script')
      tag.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2'

      tag.addEventListener('load', () => this.loadVideo())

      const facebookRoot = document.createElement('div')
      facebookRoot.id = 'fb-root'

      document.body.appendChild(facebookRoot)
      document.body.appendChild(tag)
    } else {
      this.loadVideo()
    }
  }

  play() {
    this.player.play()
  }

  pause() {
    this.player.pause()
  }

  seek(time) {
    this.remote = true
    this.time = time
    this.date = Date.now() / 1000
    this.player.seek(time)
  }

  loadVideo() {
    // @ts-ignore
    window.FB.Event.subscribe('xfbml.ready', (msg) => {
      if (msg.type === 'video') {
        this.player = msg.instance

        this.player.subscribe('startedPlaying', () => {
          if(this.playbackState === PlaybackState.paused) {
            this.props.socket.emit('play', this.player.getCurrentPosition())
            setTimeout(() => {
              if(this.playbackState === PlaybackState.paused) {
                this.pause()
              }
            }, 100)
          }
        })
        this.player.subscribe('paused', () => {
          if(this.playbackState === PlaybackState.playing) {
            this.props.socket.emit('pause', this.player.getCurrentPosition())
            setTimeout(() => {
              if(this.playbackState === PlaybackState.playing) {
                this.play()
              }
            }, 100)
          }
        })
        setInterval(() => {
          if(Math.abs(this.player.getCurrentPosition() + this.date - this.time - Date.now() / 1000) > 2 && !this.remote) {
            this.props.socket.emit('seek', this.player.getCurrentPosition())
          }
          this.remote = false
        }, 1000)

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
    })

    // @ts-ignore
    window.FB.XFBML.parse()
  }

  componentWillUnmount() {
    this.props.socket.removeAllListeners('play')
    this.props.socket.removeAllListeners('pause')
    this.props.socket.removeAllListeners('seek')
  }

  render() {
    return (
      <div className="fb-video" data-href={`https://facebook.com/watch/?v=${this.props.link}`} data-allowfullscreen="true"/>
    )
  }
}