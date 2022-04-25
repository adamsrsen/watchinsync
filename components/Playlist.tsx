import {Component} from 'react'
import Image from 'next/image'
import List from './List'
import Video from '../objects/Video'
import Item from './Item'
import styles from './Playlist.module.scss'
import Room from '../objects/Room'
import axios from 'axios'
import Dropdown from './Dropdown'
import {toast} from 'react-hot-toast'

interface Props {
  room: Room
  playlist?: Video[]
}

export default class Playlist extends Component<Props> {
  render() {
    return (
      <List>
        {this.props.playlist.map((video, index) => (
          <Item key={video.id} index={index}>
            <div className={styles.video}>
              <div className={styles['no-overflow']}>
                <Image src={`/${video.type}.png`} alt={video.type} width={30} height={30} />
                <span className={styles['video-name']}>{video.name}</span>
              </div>
              <div>
                <Dropdown options={[
                  {
                    title: 'Remove',
                    onClick: () => toast.promise(axios.post('/api/room/playlist/remove', {roomId: this.props.room.id, videoId: video.id}), {
                      loading: 'Removing video...',
                      success: 'Video successfully removed',
                      error: 'Error occurred please try again later'
                    })
                  },
                  {
                    title: 'Skip',
                    onClick: () => toast.promise(axios.post('/api/room/playlist/skip', {roomId: this.props.room.id, videoId: video.id}), {
                      loading: 'Skipping video...',
                      success: 'Video successfully skipped',
                      error: 'Error occurred please try again later'
                    })
                  }
                ]}>
                  <Image src="/more.svg" width={24} height={24} />
                </Dropdown>
              </div>
            </div>
          </Item>
        ))}
      </List>
    )
  }
}