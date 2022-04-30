import {NextApiRequest} from 'next'
import {Server} from 'socket.io'
import {NextApiResponseSocketIO} from '../../objects/NextApiResponseSocketIO'
import * as http from 'http'
import {ironSession} from 'iron-session/express'
import {sessionOptions} from '../../lib/session'
import Permission from '../../objects/Permission'
import Permissions from '../../entity/Permissions'
import Roles from '../../entity/Roles'
import {UserRole} from '../../objects/UserRole'
import {decodeRoomId} from '../../lib/util'
import {PlaybackState} from '../../components/players/Player'
import getConnection from '../../lib/db'
import Rooms from '../../entity/Rooms'
import Users from '../../entity/Users'
import permissions from './room/permissions'
import {Connection} from 'typeorm'

const FULL_PERMISSIONS: Permission = {
  play_pause: true,
  seek: true,
  playback_speed: true,
  add_video: true,
  skip_video: true,
  remove_video: true,
  chat: true,
  video_chat: true,
  change_role: true
}

const NO_PERMISSIONS: Permission = {
  play_pause: false,
  seek: false,
  playback_speed: false,
  add_video: false,
  skip_video: false,
  remove_video: false,
  chat: false,
  video_chat: false,
  change_role: false
}

const createPermissions = (permissions: Partial<Permissions>) => ({
  play_pause: permissions.play_pause,
  seek: permissions.seek,
  playback_speed: permissions.playback_speed,
  add_video: permissions.add_video,
  skip_video: permissions.skip_video,
  remove_video: permissions.remove_video,
  chat: permissions.chat,
  video_chat: permissions.video_chat,
  change_role: permissions.change_role
})

const updatePermissions = async (connection: Connection, roomId: string, permissions: Map<UserRole, Permission>) => {
  const room = await connection
    .getRepository<Rooms>('Rooms')
    .createQueryBuilder('room')
    .leftJoinAndSelect('room.admin_permissions', 'admin_permissions')
    .leftJoinAndSelect('room.moderator_permissions', 'moderator_permissions')
    .leftJoinAndSelect('room.member_permissions', 'member_permissions')
    .where('room.id = :roomId', {roomId})
    .getOne()
  permissions.set(UserRole.OWNER, FULL_PERMISSIONS)
  permissions.set(UserRole.ADMIN, createPermissions(room.admin_permissions))
  permissions.set(UserRole.MODERATOR, createPermissions(room.moderator_permissions))
  permissions.set(UserRole.MEMBER, createPermissions(room.member_permissions))
}

const broadcastUsers = (io, users: Map<string, UserData>) => {
  io.emit('online_users', [...users.entries()].map(([socketId, user]) => ({id: user.id, socketId, username: user.username})))
}

class UserData {
  id: number
  username: string
  role: UserRole
  permissions: Permission

  constructor(id, username, role, permissions) {
    this.id = id
    this.username = username
    this.role = role
    this.permissions = permissions
  }
}

class RoomVariables {
  users: Map<string, UserData> = new Map<string, UserData>()
  permissions: Map<UserRole, Permission>
  playbackState: PlaybackState = PlaybackState.paused

  constructor(permissions) {
    this.permissions = permissions
  }
}

export const rooms = new Map<string, RoomVariables>()

export default async (req: NextApiRequest, res: NextApiResponseSocketIO) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server as http.Server, {
      path: '/api/socketio',
    })
    res.socket.server.io = io
    const connection = await getConnection()

    // @ts-ignore
    io.use((socket, next) => ironSession(sessionOptions)(socket.request, {}, next))
    io.on('connection', (socket) => {
      socket.on('join', async (roomId) => {
        try {
          roomId = decodeRoomId(roomId)
        }
        catch (e) {
          return
        }

        socket.join(roomId)
        io.in(roomId).emit('pause')
        if(!rooms.has(roomId)){
          const permissions = new Map<UserRole, Permission>()
          await updatePermissions(connection, roomId, permissions)
          rooms.set(roomId, new RoomVariables(permissions))
        }
        const userId = socket.request.session?.user?.id
        const room = rooms.get(roomId)
        if(!room.users.has(socket.id)){
          if(userId){
            let role = await connection
              .getRepository<Roles>('Roles')
              .createQueryBuilder('role')
              .select('role.role')
              .where('role.user.id = :userId AND role.room.id = :roomId', {userId, roomId})
              .getOne()
            if(!role){
              role = new Roles()
              role.role = UserRole.MEMBER
              role.room = await connection
                .getRepository<Rooms>('Rooms')
                .createQueryBuilder('room')
                .where('room.id = :roomId', {roomId})
                .getOne()
              role.user = await connection
                .getRepository<Users>('Users')
                .createQueryBuilder('user')
                .where('user.id = :userId', {userId})
                .getOne()
              await connection
                .getRepository<Roles>('Roles')
                .save(role)
            }
            room.users.set(socket.id, new UserData(socket.request.session.user.id, socket.request.session.user.username, role.role, room.permissions.get(role.role)))
          }
          else {
            room.users.set(socket.id, new UserData(null, `User #${Math.ceil(Math.random() * 1000)}`, UserRole.MEMBER, NO_PERMISSIONS))
          }
        }
        broadcastUsers(io.in(roomId), room.users)
        const user = room.users.get(socket.id)
        socket.emit('permissions', user.role, user.permissions)
        if(user.role === UserRole.OWNER) {
          socket.emit('permission_settings', [
            room.permissions.get(UserRole.MEMBER),
            room.permissions.get(UserRole.MODERATOR),
            room.permissions.get(UserRole.ADMIN)
          ])
        }

        socket.on('play', (time) => {
          if(user.permissions.play_pause){
            io.in(roomId).emit('seek', time)
            io.in(roomId).emit('play')
            room.playbackState = PlaybackState.playing
          }
        })
        socket.on('pause', (time) => {
          if(user.permissions.play_pause){
            io.in(roomId).emit('seek', time)
            io.in(roomId).emit('pause')
            room.playbackState = PlaybackState.paused
          }
        })
        socket.on('seek', (time) => {
          if(user.permissions.seek){
            io.in(roomId).emit('seek', time)
          }
        })
        socket.on('playback_rate', (playbackRate) => {
          if(user.permissions.playback_speed){
            io.in(roomId).emit('playback_rate', playbackRate)
          }
        })
        socket.on('room_update', () => {
          if(user.role === UserRole.OWNER) {
            io.in(roomId).emit('room_update')
          }
        })
        socket.on('room_delete', () => {
          if(user.role === UserRole.OWNER) {
            io.in(roomId).emit('room_delete')
          }
        })
        socket.on('permissions_update', async () => {
          if(user.role === UserRole.OWNER) {
            await updatePermissions(connection, roomId, room.permissions)
            for (let [userId, user] of room.users.entries()) {
              user.permissions = room.permissions.get(user.role)
              io.in(userId).emit('permissions', user.role, user.permissions)
            }
          }
        })
        socket.on('permissions', async () => {
          if(user.id){
            const {role} = await connection
              .getRepository<Roles>('Roles')
              .createQueryBuilder('role')
              .where('role.user.id = :userId AND role.room.id = :roomId', {userId: user.id, roomId: roomId})
              .select('role.role')
              .getOne()
            user.role = role
            user.permissions = room.permissions.get(role)
            broadcastUsers(io.in(roomId), room.users)
            socket.emit('permissions', user.role, user.permissions)
          }
        })
      })

      socket.on('disconnecting', () => {
        for(const roomId of socket.rooms) {
          if(rooms.has(roomId)) {
            const room = rooms.get(roomId)
            room.users.delete(socket.id)
            broadcastUsers(io.in(roomId), room.users)
            if(room.users.size === 0){
              rooms.delete(roomId)
            }
          }
        }
      })
    })
  }

  res.end()
}
