import {NextApiRequest, NextApiResponse} from 'next'
import bodyParser from 'body-parser'
import {promisify} from 'util'
import getConnection from '../../../lib/db'
import {sessionOptions} from '../../../lib/session'
import {withIronSessionApiRoute} from 'iron-session/next'
import Rooms from '../../../entity/Rooms'
import {decodeRoomId} from '../../../lib/util'
import Permissions from '../../../entity/Permissions'

const updatePermissions = function(update, permissions, level) {
  update.play_pause = permissions.play_pause <= level
  update.seek = permissions.seek <= level
  update.playback_speed = permissions.playback_speed <= level
  update.add_video = permissions.add_video <= level
  update.skip_video = permissions.skip_video <= level
  update.remove_video = permissions.remove_video <= level
  update.chat = permissions.chat <= level
  update.video_chat = permissions.video_chat <= level
  update. change_role = permissions.change_role <= level
}

const update = async function(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'POST') {
    await promisify(bodyParser.urlencoded())(req,res)

    let roomId
    try {
      roomId = decodeRoomId(req.body?.roomId.toString())
    }
    catch(e) {
      return res.status(400).send('roomId has invalid format')
    }

    const connection = await getConnection()
    try {
      const room = await connection
        .getRepository<Rooms>('Rooms')
        .createQueryBuilder('room')
        .innerJoinAndSelect('room.admin_permissions', 'admin_permissions')
        .innerJoinAndSelect('room.moderator_permissions', 'moderator_permissions')
        .innerJoinAndSelect('room.member_permissions', 'member_permissions')
        .where('room.id = :roomId AND room.owner.id = :userId', {roomId, userId: req.session?.user?.id})
        .getOne()

      if(!room) {
        return res.status(400).send('room does not exist or you are not a owner')
      }

      updatePermissions(room.admin_permissions, req.body, 2)
      await connection
        .getRepository<Permissions>('Permissions')
        .save(room.admin_permissions)
      updatePermissions(room.moderator_permissions, req.body, 1)
      await connection
        .getRepository<Permissions>('Permissions')
        .save(room.moderator_permissions)
      updatePermissions(room.member_permissions, req.body, 0)
      await connection
        .getRepository<Permissions>('Permissions')
        .save(room.member_permissions)
      res.end()
    }
    catch(e) {
      res.status(400).send('database error')
    }
  }
  else {
    res.status(405).end()
  }
}

export default withIronSessionApiRoute(update, sessionOptions)