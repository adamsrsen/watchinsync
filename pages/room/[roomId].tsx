import {Component} from 'react'
import Head from 'next/head'
import RoomHeader from '../../components/RoomHeader'
import Room from '../../objects/Room'
import Player from '../../components/players/Player'
import Sidebar from '../../components/Sidebar'
import styles from '../../styles/Room.module.scss'

export default class RoomPage extends Component {
  props: {
    room: Room
  }

  render() {
    return (
      <div>
        <Head>
          <title>{this.props.room.name} - WatchInSync</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <RoomHeader room={this.props.room} />
        <div className={styles.content}>
          <div className={styles['player-container']}>
            <Player />
          </div>
          <Sidebar />
        </div>
      </div>
    )
  }
}

export async function getStaticPaths() {
  return {
    paths: [
      {
        params: {
          roomId: ':roomId'
        }
      }
    ],
    fallback: 'blocking'
  }
}

export async function getStaticProps({params}) {
  return {
    props: {
      room: {id: params.roomId, name: `Test${params.roomId}`}
    }
  }
}