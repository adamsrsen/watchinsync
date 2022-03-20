import {Component} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './RoomHeader.module.scss'
import Room from '../objects/Room'

export default class RoomHeader extends Component {
  props: {
    room: Room
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
          <h1>{this.props.room.name}</h1>
        </div>
        <div className={[styles['header-group'], styles['header-input']].join(' ')}>
          <input placeholder="Video url (https://example.com/video.mp4)" />
          <button>Add</button>
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