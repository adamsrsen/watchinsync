import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import Player from './Player'
import {createRef, RefObject} from 'react'
import {getCookie} from '../../lib/util'

export default class VideoJS extends Player {
  state: {
    remote: boolean
  }
  videoRef: RefObject<any>
  player: any
  
  constructor(props) {
    super(props)

    this.state = {
      remote: false
    }
    this.videoRef = createRef()
  }

  async componentDidMount() {
    this.player = videojs(this.videoRef.current, {
      fluid: true
    }, () => {
      this.player.volume(getCookie('volume'))
    })

    this.player.on('volumechange', () => {
      document.cookie = `volume=${this.player.volume()}; max-age=${365*24*60*60}; path=/`
    })
    this.player.on('play', () => {
      if(!this.state.remote) {
        this.props.socket.emit('play', this.player.currentTime())
        this.player.pause()
      }
      this.setState({remote: !this.state.remote})
    })
    this.player.on('pause', () => {
      if(!this.state.remote) {
        this.props.socket.emit('pause', this.player.currentTime())
        this.player.play()
      }
      this.setState({remote: !this.state.remote})
    })
    this.player.on('seeking', () => {
      if(!this.state.remote) {
        this.props.socket.emit('seek', this.player.currentTime())
      }
      this.setState({remote: !this.state.remote})
    })

    this.props.socket.on('play', () => {
      this.setState({remote: true})
      this.player.play()
    })
    this.props.socket.on('pause', () => {
      this.setState({remote: true})
      this.player.pause()
    })
    this.props.socket.on('seek', (time) => {
      this.setState({remote: true})
      this.player.currentTime(time)
    })
  }

  componentWillUnmount() {
    this?.player?.dispose()
  }

  render() {
    return (
      <div data-vjs-player>
        <video ref={this.videoRef} className="video-js vjs-big-play-centered" controls={true}>
          <source src={this.props.link}/>
        </video>
      </div>
    )
  }
}