import {NextApiRequest, NextApiResponse} from 'next'
import bodyParser from 'body-parser'
import {promisify} from 'util'
import getConnection from '../../../lib/db'
import Users from '../../../entity/Users'
import bcrypt from 'bcrypt'
import {sessionOptions} from '../../../lib/session'
import {withIronSessionApiRoute} from 'iron-session/next'

const login = async function(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'POST') {
    await promisify(bodyParser.urlencoded())(req,res)

    const connection = await getConnection()
    try {
      const user = await connection
        .getRepository<Users>('Users')
        .createQueryBuilder('user')
        .where('user.email = :email', {email: req.body?.email})
        .getOne()
      if(user && await bcrypt.compare(req.body?.password, user.password)){
        req.session.user = {
          id: user.id,
          username: user.username
        }
        await req.session.save()
        res.end()
      }
      else {
        res.status(400).send('invalid credentials')
      }
    }
    catch(e) {
      res.status(400).send('database error')
    }
  }
  else {
    res.status(404).send('')
  }
}

export default withIronSessionApiRoute(login, sessionOptions)