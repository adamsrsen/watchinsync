import {NextApiRequest, NextApiResponse} from 'next'
import bodyParser from 'body-parser'
import {promisify} from 'util'
import getConnection from '../../../../lib/db'
import Videos from '../../../../entity/Videos'
import {decodeRoomId} from '../../../../lib/util'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
      res.send('')
    }
    catch(e) {
      res.status(400).send('database error')
    }
  }
  else {
    res.status(404).send('')
  }
}