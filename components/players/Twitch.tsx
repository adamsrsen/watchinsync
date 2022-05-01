import Player, {PlaybackState} from './Player'
import styles from './Twitch.module.scss'

export default class Twitch extends Player {
  componentDidMount() {
    // @ts-ignore
    if(!window.Twitch) {
      const tag = document.createElement('script')
      tag.src = 'https://player.twitch.tv/js/embed/v1.js'

      tag.addEventListener('load', () => this.loadVideo())

      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
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
    if(this.player){
      this.player.setVideo(this.props.link)
    }
    else{
      // @ts-ignore
      this.player = new window.Twitch.Player('twitch-player', {
        video: this.props.link,
        width: '100%',
        height: '100%',
        autoplay: false
      })

      // Listen to play event and send socket if it was user input
      // @ts-ignore
      this.player.addEventListener(window.Twitch.Player.PLAY, () => {
        if(this.playbackState !== PlaybackState.playing) {
          this.props.socket.emit('play', this.player.getCurrentTime())
          setTimeout(() => {
            if(this.playbackState === PlaybackState.paused) {
              this.pause()
            }
          }, 100)
        }
      })
      // Listen to pause event and send socket if it was user input
      // @ts-ignore
      this.player.addEventListener(window.Twitch.Player.PAUSE, () => {
        if(this.playbackState !== PlaybackState.paused) {
          if(this.player.getPlaybackStats().bufferSize < 1) {
            this.props.socket.emit('buffer')
            this.pause()
            this.playbackState = PlaybackState.buffering
            const buffering = setInterval(() => {
              if(this.player.getPlaybackStats().bufferSize > 10){
                this.props.socket.emit('ready')
                this.playbackState = PlaybackState.paused
                clearInterval(buffering)
              }
            }, 1000)
          }
          else {
            this.props.socket.emit('pause', this.player.getCurrentTime())
            setTimeout(() => {
              if(this.playbackState === PlaybackState.playing) {
                this.play()
              }
            }, 100)
          }
        }
      })
      // Listen to seek event and send socket if it was user input
      // @ts-ignore
      this.player.addEventListener(window.Twitch.Player.SEEK, ({position}) => {
        if(!this.remote) {
          this.props.socket.emit('seek', position)
        }
        this.remote = false
      })
      // Listen to end event and play next
      // @ts-ignore
      this.player.addEventListener(window.Twitch.Player.ENDED, () => {
        this.ended()
      })

      this.initSockets()
    }
  }

  componentWillUnmount() {
    this.deinitSockets()
  }

  render() {
    return (
      <div id="twitch-player" className={styles.player} />
    )
  }
}