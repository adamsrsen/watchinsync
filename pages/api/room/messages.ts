import {NextApiRequest} from 'next'
import {sessionOptions, verifyPermission} from '../../../lib/session'
import {withIronSessionApiRoute} from 'iron-session/next'
import {decodeRoomId} from '../../../lib/util'
import getConnection from '../../../lib/db'
import Messages from '../../../entity/Messages'
import {promisify} from 'util'
import bodyParser from 'body-parser'
import {NextApiResponseSocketIO} from '../../../objects/NextApiResponseSocketIO'

const message = async function(req: NextApiRequest, res: NextApiResponseSocketIO) {
  let roomId
  const connection = await getConnection()
  if(!req.session?.user?.id) {
    res.status(401).end()
    return
  }
  switch(req.method) {
    case 'GET':
      try {
        roomId = decodeRoomId(req.query.roomId.toString())
      }
      catch(e) {
        return res.status(400).send('roomId has invalid format')
      }
      if(!await verifyPermission(roomId, req.session.user.id, 'chat')){
        res.status(401).end()
        return
      }

      try {
        const messages = await connection
          .getRepository<Messages>('Messages')
          .createQueryBuilder('message')
          .innerJoin('message.user', 'user')
          .select(['message.text', 'message.timestamp', 'user.id', 'user.username'])
          .where('message.room.id = :roomId', {roomId})
          .orderBy('message.timestamp', 'DESC')
          .limit(100)
          .offset(parseInt(req.query?.offset?.toString()) || 0)
          .getMany()
        if(!messages) {
          return res.json([])
        }
        res.json(messages.map((message) => ({user: {id: message.user.id, username: message.user.username}, text: message.text, timestamp: message.timestamp.getTime()})))
      }
      catch (e) {
        res.status(400).send('database error')
      }
      break
    case 'POST':
      await promisify(bodyParser.urlencoded())(req,res)

      try {
        roomId = decodeRoomId(req.body.roomId.toString())
      }
      catch(e) {
        return res.status(400).send('roomId has invalid format')
      }
      if(!await verifyPermission(roomId, req.session.user.id, 'chat')){
        res.status(401).end()
        return
      }
      if(!req.body?.message) {
        return res.status(400).send('message is not specified')
      }

      try {
        const timestamp = new Date()
        await connection
          .createQueryBuilder()
          .insert()
          .into<Messages>('Messages')
          .values({
            text: req.body.message,
            timestamp,
            room: {
              id: roomId
            },
            user: {
              id: req.session.user.id
            }
          })
          .execute()
        res.socket?.server?.io.in(roomId).emit('message', {user: {id: req.session.user.id, username: req.session.user.username}, text: req.body.message, timestamp: timestamp.getTime()})
        res.end()
      }
      catch (e) {
        console.log(e)
        res.status(400).send('database error')
      }
      break
    default:
      res.status(405).end()
  }
}

export default withIronSessionApiRoute(message, sessionOptions)