import {NextApiRequest, NextApiResponse} from 'next'
import bodyParser from 'body-parser'
import {promisify} from 'util'
import getConnection from '../../../lib/db'
import {sessionOptions} from '../../../lib/session'
import {withIronSessionApiRoute} from 'iron-session/next'
import Rooms from '../../../entity/Rooms'
import {decodeRoomId} from '../../../lib/util'

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

    if(!req.body?.name){
      res.status(400).send('room name is not specified')
      return
    }

    const connection = await getConnection()
    try {
      await connection
        .createQueryBuilder()
        .update<Rooms>('Rooms')
        .set({
          name: req.body.name,
          public: req.body?.public
        })
        .where('id = :roomId AND owner.id = :userId', {roomId, userId: req.session.user.id})
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

export default withIronSessionApiRoute(update, sessionOptions)