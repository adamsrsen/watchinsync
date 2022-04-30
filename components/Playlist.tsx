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
import Permission from '../objects/Permission'

const videoLinks = {
  direct: (link) => link,
  youtube: (link) => `https://youtube.com/watch?v=${link}`,
  vimeo: (link) => `https://vimeo.com/${link}`,
  twitch: (link) => `https://www.twitch.tv/videos/${link}`,
  facebook: (link) => `https://www.facebook.com/watch/?v=${link}`
}

interface Props {
  room: Room
  playlist?: Video[]
  permissions?: Permission
}

export default class Playlist extends Component<Props> {
  render() {
    const options = [
      (video) => ({
        title: 'Copy link',
        onClick: async () => {
          if ('clipboard' in navigator) {
            return await navigator.clipboard.writeText(videoLinks[video.type](video.link))
          } else {
            return document.execCommand('copy', true, videoLinks[video.type](video.link))
          }
        }
      })
    ]
    if(this.props?.permissions?.skip_video){
      options.push((video) => ({
        title: 'Skip',
        onClick: () => toast.promise(axios.post('/api/room/playlist/skip', {roomId: this.props.room.id, videoId: video.id}), {
          loading: 'Skipping video...',
          success: 'Video successfully skipped',
          error: 'Error occurred please try again later'
        })
      }))
    }
    if(this.props?.permissions?.skip_video){
      options.push((video) => ({
        title: 'Remove',
        onClick: () => toast.promise(axios.post('/api/room/playlist/remove', {roomId: this.props.room.id, videoId: video.id}), {
          loading: 'Removing video...',
          success: 'Video successfully removed',
          error: 'Error occurred please try again later'
        })
      }))
    }
    return (
      <List>
        {this.props?.playlist?.length ? this.props.playlist.map((video, index) => (
          <Item key={video.id} index={index}>
            <div className={styles.video}>
              <div className={styles['no-overflow']}>
                <Image src={`/${video.type}.png`} alt={video.type} width={30} height={30} />
                <span className={styles['video-name']}>{video.name}</span>
              </div>
              <div>
                <Dropdown options={options.map((option) => option(video))}>
                  <Image src="/more.svg" width={24} height={24} />
                </Dropdown>
              </div>
            </div>
          </Item>
        )) : (
          <Item index={0}>
            <p className={styles.center}>Empty playlist</p>
          </Item>
        )}
      </List>
    )
  }
}