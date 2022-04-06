import {Component} from 'react'
import Image from 'next/image'
import List from './List'
import Video from '../objects/Video'
import Item from './Item'
import styles from './Playlist.module.scss'
import Room from '../objects/Room'
import axios from 'axios'
import Dropdown from './Dropdown'

interface Props {
  room: Room
  playlist?: Video[]
}

export default class Playlist extends Component<Props> {
  render() {
    return (
      <List>
        {this.props.playlist.map((video) => (
          <Item key={video.id}>
            <div className={styles.video}>
              <div className={styles['no-overflow']}>
                <Image src={`/${video.type}.png`} alt={video.type} width={30} height={30} />
                <span className={styles['video-name']}>{video.name}</span>
              </div>
              <div>
                <Dropdown options={[
                  {
                    title: 'Remove',
                    onClick: () => {
                      axios.post('/api/room/playlist/remove', {roomId: this.props.room.id, videoId: video.id}).then(() => {}).catch((e) => {})
                    }
                  }
                ]}>
                  <Image src="/more.svg" width={35} height={35} />
                </Dropdown>
              </div>
            </div>
          </Item>
        ))}
      </List>
    )
  }
}