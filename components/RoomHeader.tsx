import {Component} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './RoomHeader.module.scss'
import Room from '../objects/Room'
import axios from 'axios'

interface Props {
  room?: Room
}

export default class RoomHeader extends Component<Props> {
  state:{
    videoLink: string
  }

  constructor(props) {
    super(props)

    this.state = {
      videoLink: ''
    }
  }

  addVideo() {
    axios.post('/api/room/playlist/add', {roomId: this.props.room.id, link: this.state.videoLink}).then(() => {
      this.setState({videoLink: ''})
    }).catch((e) => {})
  }

  render() {
    return (
      <div className={styles.header}>
        <div className={styles['header-group']}>
          <Link href="/">
            <a className={styles['header-link']}>
              <span className={styles['back']}/>
              <div>
                <Image src="/watchinsync.png" alt="WatchInSync logo" width={50} height={50}/>
              </div>
            </a>
          </Link>
          <h1>{this.props.room?.name}</h1>
        </div>
        <div className={[styles['header-group'], styles['header-input']].join(' ')}>
          <input placeholder="Videos url (https://example.com/video.mp4)" value={this.state.videoLink} onChange={(e) => this.setState({videoLink: e.target.value})} />
          <button onClick={() => this.addVideo()}>Add</button>
        </div>
        <div className={styles['header-group']}>
          <span className={[styles['header-link'], styles['header-text']].join(' ')}>
            Settings
          </span>
        </div>
      </div>
    )
  }
}