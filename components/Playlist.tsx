import {Component} from 'react'
import Image from 'next/image'
import List from './List'
import Video from '../objects/Video'
import Item from './Item'
import styles from './Playlist.module.scss'
import Room from '../objects/Room'

interface Props {
  room: Room
}

export default class Playlist extends Component<Props> {
  state: {
    videos: Video[]
  }

  constructor(props) {
    super(props)

    this.state = {
      videos: [
        {
          id: 1,
          name: 'test1',
          url: 'https://example.com/test1.mp4',
          type: 'youtube'
        },
        {
          id: 2,
          name: 'test2',
          url: 'https://example.com/test2.mp4',
          type: 'facebook'
        },
        {
          id: 3,
          name: 'test3',
          url: 'https://example.com/test3.mp4',
          type: 'vimeo'
        },
        {
          id: 4,
          name: 'test4',
          url: 'https://example.com/test4.mp4',
          type: 'twitch'
        },
        {
          id: 5,
          name: 'test5',
          url: 'https://example.com/test5.mp4',
          type: 'direct'
        }
      ]
    }
  }

  render() {
    return (
      <List>
        {this.state.videos.map((video) => (
          <Item key={video.id}>
            <div className={styles.video}>
              <div>
                <Image src={`/${video.type}.png`} alt={video.type} width={30} height={30} />
                <span>{video.name}</span>
              </div>
              <div>
                
              </div>
            </div>
          </Item>
        ))}
      </List>
    )
  }
}