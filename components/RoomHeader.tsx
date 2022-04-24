import {Component} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './RoomHeader.module.scss'
import Room from '../objects/Room'
import axios from 'axios'
import {preventDefault} from '../lib/util'
import {toast} from 'react-hot-toast'
import Modal from './Modal'
import Tabs, {Tab} from './Tabs'
import Input from './Input'
import Checkbox from './Checkbox'
import Button, {ButtonColor, ButtonSize, ButtonWidth} from './Button'
import Divider from './Divider'
import Permission from '../objects/Permission'
import {UserRole} from '../objects/UserRole'
import {Socket} from 'socket.io-client'

interface Props {
  room: Room
  role: UserRole
  permissions: Permission
  permissionOptions: {
    name: string,
    key: string
  }[]
  permissionSettings: Permission[]
  socket: Socket
}

export default class RoomHeader extends Component<Props> {
  state: {
    roomName: string
    videoLink: string
    settingsOpened: boolean
    public: boolean
    permissionSettings: Permission[]
  }

  constructor(props) {
    super(props)

    this.state = {
      roomName: this.props.room.name,
      videoLink: '',
      settingsOpened: false,
      public: this.props.room.public,
      permissionSettings: this.props.permissionSettings
    }
  }

  saveRoomSettings() {
    toast.promise(axios.post('/api/room/update', {roomId: this.props.room.id, name: this.state.roomName, public: this.state.public}), {
      loading: 'Updating room settings...',
      success: () => {
        this.props.socket.emit('room_update')
        return 'Room updated successfully'
      },
      error: 'Error occurred please try again later'
    })
  }

  deleteRoom() {
    toast.promise(axios.post('/api/room/delete', {roomId: this.props.room.id}), {
      loading: 'Deleting room...',
      success: () => {
        this.props.socket.emit('room_delete')
        return 'Room deleted succesfully'
      },
      error: 'Error occurred please try again later'
    })
  }

  roomSettings() {
    return new Tab({
      title: 'Room',
      content: (
        <>
          <form onSubmit={preventDefault(() => this.saveRoomSettings())}>
            <Input type="text" placeholder="Room name" value={this.state.roomName} onChange={({target}) => {this.setState({roomName: target.value})}} />
            <Checkbox checked={this.state.public} onChange={() => this.setState({public: !this.state.public})}>
              Public
            </Checkbox>
            <Button size={ButtonSize.small} width={ButtonWidth.fullwidth} color={ButtonColor.primary}>
              <b>SAVE</b>
            </Button>
          </form>
          <Divider />
          <Button size={ButtonSize.small} width={ButtonWidth.fullwidth} color={ButtonColor.secondary} onClick={() => this.deleteRoom()}>
            <b>DELETE ROOM</b>
          </Button>
        </>
      )
    })
  }

  changePermissions(permission_level, permission) {
    const permissions = this.state.permissionSettings

    if(permissions[permission_level][permission]) {
      for(let i = permission_level; i >= 0; i--){
        permissions[i][permission] = false
      }
    }
    else {
      for(let i = permission_level; i < 3; i++){
        permissions[i][permission] = true
      }
    }

    this.setState({permissionSettings: permissions})
  }

  updatePermissions() {
    toast.promise(axios.post('/api/room/permissions/update', {roomId: this.props.room.id, permissions: this.state.permissionSettings}), {
      loading: 'Updating room permissions...',
      success: () => {
        this.props.socket.emit('room_update')
        return 'Room updated successfully'
      },
      error: 'Error occurred please try again later'
    })
  }

  permissionSettings() {
    return new Tab({
      title: 'Permissions',
      content: (
        <form onSubmit={preventDefault(() => this.updatePermissions())}>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Member</th>
                <th>Moderator</th>
                <th>Admin</th>
              </tr>
            </thead>
            <tbody>
              {this.props?.permissionOptions?.map((option, index) => (
                <tr key={index}>
                  <td>
                    {option.name}
                  </td>
                  {this.props.permissionSettings.map((permissions, index) => (
                     <td key={index}>
                       <div className={styles.checkbox}>
                        <Checkbox onChange={() => {this.changePermissions(index, option.key)}} checked={permissions[option.key]} />
                       </div>
                     </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <Button size={ButtonSize.small} width={ButtonWidth.fullwidth} color={ButtonColor.primary}>
            <b>SAVE</b>
          </Button>
        </form>
      )
    })
  }

  userSettings() {
    return new Tab({
      title: 'User',
      content: (
        <p>User</p>
      )
    })
  }

  addVideo() {
    toast.promise(axios.post('/api/room/playlist/add', {roomId: this.props.room.id, link: this.state.videoLink}),{
      loading: 'Adding video...',
      success: () => {
        this.setState({videoLink: ''})
        return 'Video successfully added'
      },
      error: 'Invalid video link'
    })

  }

  render() {
    const settings = []
    if(this.props.role === UserRole.OWNER) {
      settings.push(this.roomSettings(),this.permissionSettings())
    }
    settings.push(this.userSettings())

    return (
      <div className={styles.header}>
        <div className={styles['header-group']}>
          <Link href="/">
            <a className={styles['header-link']}>
              <span className={styles['back']}/>
              <div>
                <Image src="/watchinsync.png" alt="WatchInSync logo" width={50} height={50}/>
              </div>
            </a>
          </Link>
          <h1>{this.props.room?.name}</h1>
        </div>
        {this.props.permissions?.add_video && (
          <form className={[styles['header-group'], styles['header-input']].join(' ')} onSubmit={preventDefault(() => this.addVideo())}>
            <input placeholder="Videos url (https://example.com/video.mp4)" value={this.state.videoLink} onChange={(e) => this.setState({videoLink: e.target.value})} />
            <button>Add</button>
          </form>
        )}
        <div className={styles['header-group']}>
          <span className={[styles['header-link'], styles['header-text']].join(' ')} onClick={() => this.setState({settingsOpened: true})}>
            Settings
          </span>
          <Modal close={() => this.setState({settingsOpened: false})} open={this.state.settingsOpened}>
            <Tabs tabs={settings} />
          </Modal>
        </div>
      </div>
    )
  }
}