import Player, {PlaybackState} from './Player'
import styles from './YouTube.module.scss'

export default class Youtube extends Player {
  interval: any

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
    super.seek(time)
    this.player.seekTo(time)
    this.remote = false
  }

  setPlaybackRate(playbackRate) {
    super.setPlaybackRate(playbackRate)
    this.player.setPlaybackRate(playbackRate)
    const checkPlaybackRate = setInterval(() => {
      if(this.player.getPlaybackRate() === this.playbackRate) {
        return clearInterval(checkPlaybackRate)
      }
      this.player.setPlaybackRate(this.playbackRate)
    }, 1000)
  }

  loadVideo() {
    if(this.player){
      this.player.destroy()
    }

    // @ts-ignore
    this.player = new window.YT.Player('yt-player', {
      videoId: this.props.link,
      events: {
        'onStateChange': (e) => {
          switch(e.data) {
            // Listen to play event and send socket if it was user input
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
            // Listen to pause event and send socket if it was user input
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
            // Listen to end event and play next
            // @ts-ignore
            case window.YT.PlayerState.ENDED:
              this.ended()
              break
          }
        },
        // Listen to playback rate event and send socket if it was user input
        'onPlaybackRateChange': (e) => {
          if(e.data !== this.playbackRate) {
            this.props.socket.emit('playback_rate', e.data)
          }
        }
      }
    })

    // Detecting seek and sending socket
    clearInterval(this.interval)
    this.interval = setInterval(() => {
      if(((Math.abs(this.player.getCurrentTime() + this.date - this.time - Date.now() / 1000) > 2 && this.playbackState === PlaybackState.playing)
        || (Math.abs(this.player.getCurrentTime() - this.time) > 0 && this.playbackState === PlaybackState.paused))
        && !this.remote) {
        this.props.socket.emit('seek', this.player.getCurrentTime())
      }
    }, 1000)

    this.initSockets()
  }

  componentWillUnmount() {
    clearInterval(this.interval)
    this?.player?.destroy()

    this.deinitSockets()
  }

  render() {
    return (
      <div id="yt-player" className={styles.player} />
    )
  }
}