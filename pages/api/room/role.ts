import {NextApiRequest} from 'next'
import bodyParser from 'body-parser'
import {promisify} from 'util'
import getConnection from '../../../lib/db'
import {sessionOptions, verifyPermission} from '../../../lib/session'
import {withIronSessionApiRoute} from 'iron-session/next'
import {decodeRoomId} from '../../../lib/util'
import Roles from '../../../entity/Roles'
import {NextApiResponseSocketIO} from '../../../objects/NextApiResponseSocketIO'

const update = async function(req: NextApiRequest, res: NextApiResponseSocketIO) {
  if(req.method === 'POST') {
    await promisify(bodyParser.urlencoded())(req,res)

    let roomId
    try {
      roomId = decodeRoomId(req.body?.roomId.toString())
    }
    catch(e) {
      return res.status(400).send('roomId has invalid format')
    }

    if(!req.body?.userId){
      return res.status(400).send('user id is not specified')
    }

    if(!req.body?.role){
      return res.status(400).send('role is not specified')
    }

    const connection = await getConnection()
    if(!await verifyPermission(roomId, req.session.user.id, 'change_role')){
      res.status(401).end()
      return
    }
    try {
      await connection
        .createQueryBuilder()
        .update<Roles>('Roles')
        .set({
          role: req.body.role
        })
        .where('room.id = :roomId AND user.id = :userId', {roomId, userId: req.body.userId})
        .execute()
      if(req.body?.socketId) {
        res.socket?.server?.io.in(req.body.socketId).emit('permissions_update')
      }
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