import {NextApiRequest} from 'next'
import bodyParser from 'body-parser'
import {promisify} from 'util'
import getConnection from '../../../../lib/db'
import Videos from '../../../../entity/Videos'
import {decodeRoomId} from '../../../../lib/util'
import {NextApiResponseSocketIO} from '../../../../objects/NextApiResponseSocketIO'

export default async function handler(req: NextApiRequest, res: NextApiResponseSocketIO) {
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
        .update<Videos>('Videos')
        .set({
          played: true
        })
        .where('id = :videoId AND room.id = :roomId', {videoId: req.body?.videoId, roomId})
        .execute()

      const io = res.socket?.server?.io
      setTimeout(() => {
        io.in(req.body?.roomId.toString()).emit('skip', req.body?.videoId)
      }, req.body.delay ?? 1000)

      res.end()
    }
    catch(e) {
      res.status(400).send('database error')
    }
  }
  else {
    res.status(404).send('')
  }
}

