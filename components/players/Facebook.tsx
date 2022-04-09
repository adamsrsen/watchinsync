import Player, {PlaybackState} from './Player'

export default class Facebook extends Player {
  interval: any
  ready: Function

  constructor(props) {
    super(props)

    this.ready = (msg) => {
      if (msg.type === 'video') {
        this.player = msg.instance

        // Listen to play event and send socket if it was user input
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
        // Listen to pause event and send socket if it was user input
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
        // Listen to end event and play next
        this.player.subscribe('finishedPlaying', () => {
          this.ended()
        })

        // Detecting seek and sending socket
        clearInterval(this.interval)
        this.interval = setInterval(() => {
          if(((Math.abs(this.player.getCurrentPosition() + this.date - this.time - Date.now() / 1000) > 2 && this.playbackState === PlaybackState.playing)
            || (Math.abs(this.player.getCurrentPosition() - this.time) > 0 && this.playbackState === PlaybackState.paused))
            && !this.remote) {
            this.props.socket.emit('seek', this.player.getCurrentPosition())
          }
          this.remote = false
        }, 1000)

        this.initSockets()
      }
    }
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
    super.seek(time)
    this.player.seek(time)
  }

  loadVideo() {
    // @ts-ignore
    window.FB.Event.unsubscribe('xfbml.ready', this.ready)
    // @ts-ignore
    window.FB.Event.subscribe('xfbml.ready', this.ready)

    // @ts-ignore
    window.FB.XFBML.parse()
  }

  componentWillUnmount() {
    this.deinitSockets()
  }

  render() {
    return (
      <div className="fb-video" data-href={`https://facebook.com/watch/?v=${this.props.link}`} data-allowfullscreen="true"/>
    )
  }
}