import {NextApiRequest, NextApiResponse} from 'next'
import bodyParser from 'body-parser'
import {promisify} from 'util'
import getConnection from '../../../lib/db'
import Users from '../../../entity/Users'
import bcrypt from 'bcrypt'
import {sessionOptions} from '../../../lib/session'
import {withIronSessionApiRoute} from 'iron-session/next'
import {checkPassword, checkPasswords} from '../../../lib/verify'

const changePassword = async function(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'POST') {
    await promisify(bodyParser.urlencoded())(req,res)

    if(!req.session?.user?.id) {
      res.status(401).end()
      return
    }

    if(!checkPassword(req.body?.newPassword)){
      res.status(400).send('new password is invalid')
      return
    }

    if(!checkPasswords(req.body?.newPassword, req.body?.newPasswordRepeat)){
      res.status(400).send('passwords does not match')
      return
    }

    const connection = await getConnection()
    try {
      const user = await connection
        .getRepository<Users>('Users')
        .createQueryBuilder('user')
        .where('user.id = :id', {id: req.session.user.id})
        .getOne()
      if(user && await bcrypt.compare(req.body?.password, user.password)){
        user.password = await bcrypt.hash(req.body?.newPassword, 10)
        await connection.getRepository<Users>('Users').save(user)
        res.end()
      }
      else {
        res.status(400).send('password is invalid')
      }
    }
    catch(e) {
      res.status(400).send('database error')
    }
  }
  else {
    res.status(405).end()
  }
}

export default withIronSessionApiRoute(changePassword, sessionOptions)