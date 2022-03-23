import {Component} from 'react'
import styles from './Sidebar.module.scss'
import Tabs, {Tab} from './Tabs'
import Playlist from './Playlist'
import Chat from './Chat'
import Room from '../objects/Room'

interface Props {
  room: Room
}

export default class Sidebar extends Component<Props> {
  render() {
    return (
      <div className={styles.sidebar}>
        <Tabs tabs={[
          new Tab({
            title: 'Playlist',
            content: <Playlist room={this.props.room} />
          }),
          new Tab({
            title: 'Chat',
            content: <Chat room={this.props.room} />
          })
        ]} />
      </div>
    )
  }
}