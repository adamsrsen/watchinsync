import {NextApiRequest, NextApiResponse} from 'next'
import bodyParser from 'body-parser'
import {promisify} from 'util'
import {v4 as uuidv4} from 'uuid'
import getConnection from '../../../lib/db'
import Rooms from '../../../entity/Rooms'
import {encode} from 'uuid-base64-ts'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'POST') {
    await promisify(bodyParser.urlencoded())(req,res)

    if(!req.body?.name){
      return res.status(400).send('name is not specified')
    }

    const connection = await getConnection()
    try {
      let id = uuidv4()
      while(await connection
        .getRepository<Rooms>('Rooms')
        .createQueryBuilder('room')
        .where('room.id = :id', {id})
        .getOne()
      ) {
        id = uuidv4()
      }
      await connection
        .createQueryBuilder()
        .insert()
        .into<Rooms>('Rooms')
        .values({
          id,
          name: req.body?.name,
          public: req.body?.public
        })
        .execute()
      res.send({id: encode(id)})
    }
    catch(e) {
      res.status(400).send('database error')
    }
  }
  else {
    res.status(404).send('')
  }
}