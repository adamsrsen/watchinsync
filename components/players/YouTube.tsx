import Player from './Player'
import styles from './YouTube.module.scss'
import internal from 'stream'

export default class Youtube extends Player {
  player: any
  state: {
    remote: boolean
    time: number
    date: number
  }

  constructor(props) {
    super(props)

    this.state = {
      remote: false,
      time: 0,
      date: Date.now() / 1000
    }
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

  loadVideo() {
    // @ts-ignore
    this.player = new window.YT.Player('yt-player', {
      videoId: this.props.link,
      events: {
        'onStateChange': (e) => {
          switch(e.data) {
            // @ts-ignore
            case window.YT.PlayerState.PLAYING:
              if(!this.state.remote) {
                this.props.socket.emit('play', this.player.getCurrentTime())
                this.player.pauseVideo()
              }
              break
            // @ts-ignore
            case window.YT.PlayerState.PAUSED:
              if(!this.state.remote) {
                this.props.socket.emit('pause', this.player.getCurrentTime())
                this.player.playVideo()
              }
              break
          }
          // @ts-ignore
          if((e.data != window.YT.PlayerState.PLAYING || Math.abs(this.player.getCurrentTime() + this.state.date - this.state.time - Date.now() / 1000) > 1.5) && !this.state.remote) {
            this.props.socket.emit('seek', this.player.getCurrentTime())
          }
          this.setState({remote: false})
        }
      }
    })

    this.props.socket.on('play', () => {
      this.setState({remote: true})
      this.player.playVideo()
    })
    this.props.socket.on('pause', () => {
      this.setState({remote: true})
      this.player.pauseVideo()
    })
    this.props.socket.on('seek', (time) => {
      this.setState({remote: true})
      this.player.seekTo(time)
    })
  }

  componentWillUnmount() {
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