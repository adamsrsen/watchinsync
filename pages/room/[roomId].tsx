import {Component} from 'react'
import Head from 'next/head'
import {NextRouter, withRouter} from 'next/router'
import {decode} from 'uuid-base64-ts'
import RoomHeader from '../../components/RoomHeader'
import Room from '../../objects/Room'
import Player from '../../components/players/Player'
import Sidebar from '../../components/Sidebar'
import styles from '../../styles/Room.module.scss'
import CenteredContent from '../../components/CenteredContent'
import createConnection from '../../lib/db'
import Rooms from '../../entity/Rooms'

interface Props {
  room: Room
  router: NextRouter
}

class RoomPage extends Component<Props> {
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
          <Sidebar room={this.props.room} />
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
    roomId = decode(params.roomId)
  }
  catch(e) {
    return {
      notFound: true
    }
  }

  await createConnection()
  const room = await Rooms
    .createQueryBuilder('room')
    .where('room.id = :roomId', {roomId})
    .getOne()

  if(room){
    return {
      props: {
        room: {
          id: room.id,
          name: room.name
        }
      },
      revalidate: 60
    }
  }

  return {
    notFound: true
  }
}