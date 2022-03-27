import {NextApiRequest, NextApiResponse} from 'next'
import getConnection from '../../../../lib/db'
import Videos from '../../../../entity/Videos'
import {decodeRoomId} from '../../../../lib/util'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'GET') {
    const query = req.query

    let roomId
    try {
      roomId = decodeRoomId(query.roomId.toString())
    }
    catch(e) {
      return res.status(400).send('roomId has invalid format')
    }
    const connection = await getConnection()
    const playlist = await connection
      .getRepository<Videos>('Videos')
      .createQueryBuilder('video')
      .select(['video.id', 'video.type', 'video.link'])
      .where('video.room.id = :roomId AND video.played = :played', {played: false, roomId})
      .orderBy('position', 'ASC')
      .getMany()
    res.send(playlist)
  }
  else {
    res.status(404).send('')
  }
}