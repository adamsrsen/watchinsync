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
import Permission from '../../objects/Permission'
import {UserRole} from '../../objects/UserRole'
import {Router, withRouter} from 'next/router'
import UserList from '../../components/UserList'
import Users from '../../entity/Users'
import Roles from '../../entity/Roles'
import User from '../../objects/User'

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
  user: User
  users: User[]
  playlist: Video[]
  router: Router
}

class RoomPage extends Component<Props> {
  state: {
    room: Room
    playlist: Video[]
    users: User[]
    userList?: {
      id?: number
      socketId?: string
      username: string
      role?: UserRole
      online: false
    }[]
    role?: UserRole
    permissions?: Permission
    permissionOptions?: {
      name: string,
      key: string
    }[]
    permissionSettings?: Permission[]
  }
  socket: Socket
  player: RefObject<any>

  constructor(props) {
    super(props)

    this.state = {
      room: this.props.room,
      playlist: [],
      users: this.props.users
    }

    this.updatePlaylist()
    this.socket = io({path: '/api/socketio'})
    this.socket.on('update_playlist', () => {
      this.updatePlaylist()
    })
    this.socket.on('skip', (videoId) => {
      this.setState({playlist: this.state.playlist.filter((video) => video.id !== videoId)})
    })
    this.socket.on('online_users', async (users) => {
      this.state.users = (await axios.get(`/api/room/users?roomId=${encodeURIComponent(this.props.room.id)}`)).data
      const userList = this.state.users.map((user) => {
        const u = users.find((u) => u.id === user.id)
        return {id: user.id, role: user.role, socketId: u?.socketId, username: user.username, online: !!u}
      })
      const guestUsers = users.filter((user) => user.id === null)
      userList.push(...guestUsers.map((user) => ({...user, online: true})))
      userList.sort((a, b) => {
        if(a.online > b.online) {
          return -1
        }
        if(a.online < b.online) {
          return 1
        }
        if(a.username < b.username){
          return -1
        }
        return 1
      })
      this.setState({users: this.state.users, userList: userList})
    })
    this.socket.on('permissions', (role, permissions) => {
      this.setState({role: role, permissions: permissions})
    })
    this.socket.on('permission_settings', (permissions) => {
      this.setState({
        permissionOptions: [
          {
            name: 'Play/Pause',
            key: 'play_pause'
          },
          {
            name: 'Seek',
            key: 'seek'
          },
          {
            name: 'Playback speed',
            key: 'playback_speed'
          },
          {
            name: 'Add video',
            key: 'add_video'
          },
          {
            name: 'Skip video',
            key: 'skip_video'
          },
          {
            name: 'Remove video',
            key: 'remove_video'
          },
          {
            name: 'Chat',
            key: 'chat'
          },
          {
            name: 'Video chat',
            key: 'video_chat'
          },
          {
            name: 'Change role',
            key: 'change_role'
          },
        ],
        permissionSettings: permissions
      })
    })
    this.socket.on('room_update', async () => {
      axios.get(`/api/room?roomId=${encodeURIComponent(this.props.room.id)}`).then(({data}) => {
        this.setState({
          room: data
        })
      })
    })
    this.socket.on('room_delete', async () => {
      await this.props.router.push('/')
    })
    this.socket.on('permissions_update', () => {
      this.socket.emit('permissions')
    })
    this.socket.emit('join', this.props.room.id)

    this.player = createRef()
  }

  updatePlaylist() {
    axios.get(`/api/room/playlist?roomId=${encodeURIComponent(this.props.room.id)}`).then((res) => {
      this.setState({playlist: res.data})
    }).catch((e) => {})
  }

  componentWillUnmount() {
    this.socket.disconnect()
  }

  render() {
    const VideoPlayer = players[this.state.playlist[0]?.type || '']
    const tabs = [
      new Tab({
        title: 'Playlist',
        content: <Playlist room={this.state.room} playlist={this.state.playlist} permissions={this.state.permissions} />
      })
    ]
    if(this.state?.permissions?.chat) {
      tabs.push(new Tab({
        title: 'Chat',
        content: <Chat room={this.state.room} />
      }))
    }
    tabs.push(new Tab({
      title: 'Users',
      content: <UserList room={this.state.room} user={this.props.user} userList={this.state.userList} role={this.state.role} permissions={this.state.permissions} />
    }))

    return (
      <div>
        <Head>
          <title>{this.state.room.name} - WatchInSync</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <RoomHeader
          room={this.state.room}
          user={this.props.user}
          role={this.state.role}
          permissions={this.state.permissions}
          permissionOptions={this.state.permissionOptions}
          permissionSettings={this.state.permissionSettings}
          setPermissionSettings={(permissions) => this.setState({permissionSettings: permissions})}
          socket={this.socket}
          router={this.props.router}
        />
        <div className={styles.content}>
          <div className={styles['player-container']}>
            <VideoPlayer ref={this.player} roomId={this.state.room.id} videoId={this.state.playlist[0]?.id} link={this.state.playlist[0]?.link} socket={this.socket} />
          </div>
          <div className={styles.sidebar}>
            <Tabs tabs={tabs} />
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
    .where('room.id = :roomId', {roomId})
    .select(['room.id', 'room.name', 'room.public'])
    .getOne()

  if(room){
    const users = await connection
      .getRepository<Roles>('Roles')
      .createQueryBuilder('role')
      .innerJoin('role.user', 'user')
      .where('role.room.id = :roomId', {roomId})
      .select(['role.role', 'user.id', 'user.username'])
      .orderBy('user.username', 'ASC')
      .getMany()

    return {
      props: {
        room: {
          id: params.roomId,
          name: room.name,
          public: room.public
        },
        users: users.map(({role, user}) => ({id: user.id, username: user.username, role: role}))
      },
      revalidate: 60
    }
  }

  return {
    notFound: true
  }
}