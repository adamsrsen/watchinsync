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
        .delete()
        .from<Videos>('Videos')
        .where('id = :videoId AND room.id = :roomId', {videoId: req.body?.videoId, roomId})
        .execute()

      res.socket?.server?.io.in(req.body?.roomId.toString()).emit('update_playlist')

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