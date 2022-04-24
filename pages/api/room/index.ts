import {NextApiRequest, NextApiResponse} from 'next'
import {sessionOptions} from '../../../lib/session'
import {withIronSessionApiRoute} from 'iron-session/next'
import {decodeRoomId} from '../../../lib/util'
import getConnection from '../../../lib/db'
import Rooms from '../../../entity/Rooms'

const login = async function(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'GET') {
    let roomId
    try {
      roomId = decodeRoomId(req.query.roomId.toString())
    }
    catch(e) {
      return res.status(400).send('roomId has invalid format')
    }

    const connection = await getConnection()
    try {
      const room = await connection
        .getRepository<Rooms>('Rooms')
        .createQueryBuilder('room')
        .where('room.id = :roomId', {roomId})
        .select(['room.id', 'room.name', 'room.public'])
        .getOne()
      res.json({
        id: req.query.roomId,
        name: room.name,
        public: room.public
      })
    }
    catch (e) {
      res.status(400).send('database error')
    }
  }
  else {
    res.status(405).end()
  }
}

export default withIronSessionApiRoute(login, sessionOptions)