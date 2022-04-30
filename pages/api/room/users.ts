import {NextApiRequest, NextApiResponse} from 'next'
import {sessionOptions} from '../../../lib/session'
import {withIronSessionApiRoute} from 'iron-session/next'
import {decodeRoomId} from '../../../lib/util'
import getConnection from '../../../lib/db'
import Roles from '../../../entity/Roles'

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
      const users = await connection
        .getRepository<Roles>('Roles')
        .createQueryBuilder('role')
        .innerJoin('role.user', 'user')
        .where('role.room.id = :roomId', {roomId})
        .select(['role.role', 'user.id', 'user.username'])
        .orderBy('user.username', 'ASC')
        .getMany()
      res.json(users.map(({role, user}) => ({id: user.id, username: user.username, role: role})))
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