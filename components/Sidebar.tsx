import {Component} from 'react'
import styles from './Sidebar.module.scss'
import Tabs, {Tab} from './Tabs'
import Playlist from './Playlist'
import Chat from './Chat'

export default class Sidebar extends Component {
  render() {
    return (
      <div className={styles.sidebar}>
        <Tabs tabs={[
          new Tab({
            title: 'Playlist',
            content: <Playlist />
          }),
          new Tab({
            title: 'Chat',
            content: <Chat />
          })
        ]} />
      </div>
    )
  }
}