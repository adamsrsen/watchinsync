import Player, {PlaybackState} from './Player'
import styles from './Twitch.module.scss'
import _ from 'lodash'
import axios from 'axios'

export default class Twitch extends Player {
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
    this.remote = true
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

      // @ts-ignore
      this.player.addEventListener(window.Twitch.Player.PLAY, () => {
        if(this.playbackState === PlaybackState.paused) {
          this.props.socket.emit('play', this.player.getCurrentTime())
          setTimeout(() => {
            if(this.playbackState === PlaybackState.paused) {
              this.pause()
            }
          }, 100)
        }
      })
      // @ts-ignore
      this.player.addEventListener(window.Twitch.Player.PAUSE, () => {
        if(this.playbackState === PlaybackState.playing) {
          this.props.socket.emit('pause', this.player.getCurrentTime())
          setTimeout(() => {
            if(this.playbackState === PlaybackState.playing) {
              this.play()
            }
          }, 100)
        }
      })
      // @ts-ignore
      this.player.addEventListener(window.Twitch.Player.SEEK, ({position}) => {
        if(!this.remote) {
          this.props.socket.emit('seek', position)
        }
        this.remote = false
      })
      // @ts-ignore
      this.player.addEventListener(window.Twitch.Player.ENDED, () => {
        axios.post('/api/room/playlist/skip', {roomId: this.props.roomId, videoId: this.props.videoId, delay: 1000}).then(() => {}).catch((e) => {})
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
  }

  componentDidUpdate(prevProps) {
    if(!_.isEqual(this.props, prevProps)) {
      this.loadVideo()
    }
  }

  componentWillUnmount() {
    this.props.socket.removeAllListeners('play')
    this.props.socket.removeAllListeners('pause')
    this.props.socket.removeAllListeners('seek')
  }

  render() {
    return (
      <div id="twitch-player" className={styles.player} />
    )
  }
}