import {Component, createRef, RefObject} from 'react'
import Head from 'next/head'
import io, {Socket} from 'socket.io-client'
import RoomHeader from '../../components/RoomHeader'
import Room from '../../objects/Room'
import Player from '../../components/players/Player'
import getConnection from '../../lib/db'
import Rooms from '../../entity/Rooms'
import Tabs, {Tab} from '../../components/Tabs'
import Playlist from '../../components/Playlist'
import Chat from '../../components/Chat'
import styles from '../../styles/Room.module.scss'
import Video from '../../objects/Video'
import {decodeRoomId} from '../../lib/util'
import axios from 'axios'
import VideoJS from '../../components/players/VideoJS'
import Youtube from '../../components/players/YouTube'
import Vimeo from '../../components/players/Vimeo'
import Twitch from '../../components/players/Twitch'
import Facebook from '../../components/players/Facebook'

const players = {
  '': Player,
  'direct': VideoJS,
  'youtube': Youtube,
  'vimeo': Vimeo,
  'twitch': Twitch,
  'facebook': Facebook
}

interface Props {
  room: Room
  playlist: Video[]
}

export default class RoomPage extends Component<Props> {
  state: {
    playlist?: Video[]
  }
  socket: Socket
  player: RefObject<any>

  constructor(props) {
    super(props)

    this.state = {
      playlist: []
    }

    this.updatePlaylist()
    this.socket = io({path: '/api/socketio'})
    this.socket.on('update_playlist', () => {
      this.updatePlaylist()
    })
    this.socket.on('skip', (videoId) => {
      this.setState({playlist: this.state.playlist.filter((video) => video.id !== videoId)})
    })
    this.socket.emit('join', this.props.room.id)

    this.player = createRef()
  }

  updatePlaylist() {
    axios.get(`/api/room/playlist?roomId=${this.props.room.id}`).then((res) => {
      this.setState({playlist: res.data})
    }).catch((e) => {})
  }

  componentWillUnmount() {
    this.socket.disconnect()
  }

  render() {
    const VideoPlayer = players[this.state.playlist[0]?.type || '']

    return (
      <div>
        <Head>
          <title>{this.props.room.name} - WatchInSync</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <RoomHeader room={this.props.room} />
        <div className={styles.content}>
          <div className={styles['player-container']}>
            <VideoPlayer ref={this.player} roomId={this.props.room.id} videoId={this.state.playlist[0]?.id} link={this.state.playlist[0]?.link} socket={this.socket} />
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
    .where('room.id = :roomId', {roomId})
    .select(['room.id', 'room.name'])
    .getOne()

  if(room){
    return {
      props: {
        room: {
          id: params.roomId,
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