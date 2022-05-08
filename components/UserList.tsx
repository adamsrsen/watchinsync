import {Component} from 'react'
import Image from 'next/image'
import List from './List'
import Item from './Item'
import styles from './UserList.module.scss'
import Room from '../objects/Room'
import Dropdown from './Dropdown'
import Permission from '../objects/Permission'
import {UserRole} from '../objects/UserRole'
import {toast} from 'react-hot-toast'
import axios from 'axios'
import User from '../objects/User'

interface Props {
  room: Room
  user: User
  userList: {
      id?: number
      socketId?: string
      username: string
      role?: UserRole
      online: false
    }[]
  role?: UserRole
  permissions?: Permission
}

export default class UserList extends Component<Props> {
  setRole(user, role) {
    toast.promise(axios.post('/api/room/role', {userId: user.id, socketId: user.socketId, roomId: this.props.room.id, role}), {
      loading: 'Changing users role',
      success: 'Users role successfully changed',
      error: 'Error occurred please try again later'
    })
  }

  render() {
    const options = []
    if(this.props.role < UserRole.MEMBER) {
      options.push((user) => ({
        title: 'Set role to member',
        onClick: () => this.setRole(user, UserRole.MEMBER)
      }))
    }
    if(this.props.role <= UserRole.MODERATOR) {
      options.push((user) => ({
        title: 'Set role to moderator',
        onClick: () => this.setRole(user, UserRole.MODERATOR)
      }))
    }
    if(this.props.role <= UserRole.ADMIN) {
      options.push((user) => ({
        title: 'Set role to admin',
        onClick: () => this.setRole(user, UserRole.ADMIN)
      }))
    }
    return (
      <List>
        {this.props.userList.map((user, index) => (
          <Item key={index} index={index}>
            <div className={styles.user}>
              <div className={styles['no-overflow']}>
                <div className={`${styles.status}${user.online ? ` ${styles.online}` : ''}`}></div>
                <span className={styles.username}>{user.username}</span>
              </div>
              {this.props.permissions.change_role && user.id && user.id !== this.props.user.id && user.role > this.props.role && (
                <div>
                  <Dropdown options={options.map((option) => option(user))}>
                    <Image src="/more.svg" width={24} height={24} alt="options" />
                  </Dropdown>
                </div>
              )}
            </div>
          </Item>
        ))}
      </List>
    )
  }
}