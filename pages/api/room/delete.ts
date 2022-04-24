import {NextApiRequest, NextApiResponse} from 'next'
import bodyParser from 'body-parser'
import {promisify} from 'util'
import getConnection from '../../../lib/db'
import {decodeRoomId} from '../../../lib/util'
import Rooms from '../../../entity/Rooms'
import {withIronSessionApiRoute} from 'iron-session/next'
import {sessionOptions} from '../../../lib/session'
import Permissions from '../../../entity/Permissions'

async function deleteRoom(req: NextApiRequest, res: NextApiResponse) {
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

      await connection
        .createQueryBuilder()
        .delete()
        .from<Rooms>('Rooms')
        .where('id = :roomId AND owner.id = :userId', {roomId, userId: req.session?.user?.id})
        .execute()
      await connection
        .createQueryBuilder()
        .delete()
        .from<Permissions>('Permissions')
        .where('id IN (:...ids)', {ids: [room.admin_permissions.id, room.moderator_permissions.id, room.member_permissions.id]})
        .execute()

      res.end()
    }
    catch(e) {
      console.log(e)
      res.status(400).send('database error')
    }
  }
  else {
    res.status(405).end()
  }
}

export default withIronSessionApiRoute(deleteRoom, sessionOptions)