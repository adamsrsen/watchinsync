import {NextApiRequest, NextApiResponse} from 'next'
import bodyParser from 'body-parser'
import {promisify} from 'util'
import getConnection from '../../../lib/db'
import {decodeRoomId} from '../../../lib/util'
import {withIronSessionApiRoute} from 'iron-session/next'
import {sessionOptions} from '../../../lib/session'
import Roles from '../../../entity/Roles'

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
      await connection
        .createQueryBuilder()
        .delete()
        .from<Roles>('Roles')
        .where('room.id = :roomId AND user.id = :userId', {roomId, userId: req.session?.user?.id})
        .execute()

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

export default withIronSessionApiRoute(deleteRoom, sessionOptions)