import getConnection from '../../../lib/db'
import Roles, {UserRole} from '../../../entity/Roles'
import {NextApiRequest, NextApiResponse} from 'next'
import {withIronSessionApiRoute} from 'iron-session/next'
import {sessionOptions} from '../../../lib/session'
import {decodeRoomId} from '../../../lib/util'
import Rooms from '../../../entity/Rooms'
import Permission from '../../../objects/Permission'
import Users from '../../../entity/Users'

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

const permission_column = {
  [UserRole.MEMBER]: 'member_permissions',
  [UserRole.MODERATOR]: 'moderator_permissions',
  [UserRole.ADMIN]: 'admin_permissions'
}

const permissions = async function(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'GET') {
    let {roomId} = req.query
    try {
      roomId = decodeRoomId(roomId.toString())
    }
    catch(e) {
      return res.status(400).send('roomId has invalid format')
    }

    if(!req.session?.user) {
      return res.json({role: UserRole.MEMBER, permissions: NO_PERMISSIONS})
    }

    const connection = await getConnection()
    try {
      await connection
        .createQueryBuilder()
        .insert()
        .into<Roles>('Roles')
        .values({
          user: {
            id: req.session.user.id
          },
          room: {
            id: roomId
          }
        })
        .execute()
    }
    catch (e) {}
    let role = await connection
      .getRepository<Roles>('Roles')
      .createQueryBuilder('role')
      .select('role.role')
      .where('role.user.id = :userId AND role.room.id = :roomId', {userId: req.session.user.id, roomId})
      .getOne()

    if(role.role === UserRole.OWNER) {
      return res.json({role: role.role, permissions: FULL_PERMISSIONS})
    }

    const room = await connection
      .getRepository<Rooms>('Rooms')
      .createQueryBuilder('room')
      .leftJoinAndSelect(`room.${permission_column[role.role]}`, 'permissions')
      .where('room.id = :roomId', {roomId})
      .getOne()
    console.log(room)
    const permissions = room[permission_column[role.role]]

    return res.json({
      role: role.role,
      permissions: {
        play_pause: permissions.play_pause,
        seek: permissions.seek,
        playback_speed: permissions.playback_speed,
        add_video: permissions.add_video,
        skip_video: permissions.skip_video,
        remove_video: permissions.remove_video,
        chat: permissions.chat,
        video_chat: permissions.video_chat,
        change_role: permissions.change_role
      }
    })
  }
  else {
    res.status(405).end()
  }
}

export default withIronSessionApiRoute(permissions, sessionOptions)