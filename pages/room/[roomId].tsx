import {Component} from 'react'
import Head from 'next/head'
import {NextRouter, withRouter} from 'next/router'
import RoomHeader from '../../components/RoomHeader'
import Room from '../../objects/Room'
import Player from '../../components/players/Player'
import CenteredContent from '../../components/CenteredContent'
import getConnection from '../../lib/db'
import Rooms from '../../entity/Rooms'
import Tabs, {Tab} from '../../components/Tabs'
import Playlist from '../../components/Playlist'
import Chat from '../../components/Chat'
import styles from '../../styles/Room.module.scss'
import Video from '../../objects/Video'
import {decodeRoomId} from '../../lib/util'

interface Props {
  room: Room
  playlist: Video[]
  router: NextRouter
}

class RoomPage extends Component<Props> {
  state: {
    playlist?: Video[]
  }

  constructor(props) {
    super(props)

    this.state = {
      playlist: this.props.playlist
    }
  }

  render() {
    if(this.props.router.isFallback) {
      return (
        <div>
          <Head>
            <title>Loading... - WatchInSync</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <RoomHeader />
          <CenteredContent>
            <h2>Loading...</h2>
          </CenteredContent>
        </div>
      )
    }

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
          <div className={styles.sidebar}>
            <Tabs tabs={[
              new Tab({
                title: 'Playlist',
                content: <Playlist room={this.props.room} playlist={this.state.playlist} />
              }),
              new Tab({
                title: 'Chat',
                content: <Chat room={this.props.room} />
              })
            ]} />
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(RoomPage)

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
  let roomId
  try {
    roomId = decodeRoomId(params.roomId)
  }
  catch(e) {
    return {
      notFound: true
    }
  }

  const connection = await getConnection()
  const room = await connection
    .getRepository<Rooms>('Rooms')
    .createQueryBuilder('room')
    .leftJoin('room.videos', 'video', 'video.played = :played', {played: false})
    .where('room.id = :roomId', {roomId})
    .select(['room.id', 'room.name', 'video.id', 'video.link', 'video.name', 'video.type'])
    .orderBy('video.position', 'ASC')
    .getOne()

  if(room){
    return {
      props: {
        room: {
          id: params.roomId,
          name: room.name
        },
        playlist: room.videos.map((video) => ({
          id: video.id,
          link: video.link,
          name: video.name,
          type: video.type
        }))
      },
      revalidate: 60
    }
  }

  return {
    notFound: true
  }
}