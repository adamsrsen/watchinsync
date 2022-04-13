import {NextApiRequest, NextApiResponse} from 'next'
import bodyParser from 'body-parser'
import {promisify} from 'util'
import getConnection from '../../../lib/db'
import Users from '../../../entity/Users'
import bcrypt from 'bcrypt'
import {sessionOptions} from '../../../lib/session'
import {withIronSessionApiRoute} from 'iron-session/next'
import {checkEmail, checkUsername} from '../../../lib/util'

const update = async function(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'POST') {
    await promisify(bodyParser.urlencoded())(req,res)

    if(!req.session?.user?.id) {
      res.status(401).end()
      return
    }

    if(!checkUsername(req.body?.username)){
      res.status(400).send('username is not specified')
      return
    }

    if(!checkEmail(req.body?.email)){
      res.status(400).send('email is not specified')
      return
    }

    const connection = await getConnection()
    try {
      await connection
        .createQueryBuilder()
        .update<Users>('Users')
        .set({
          username: req.body.username,
          email: req.body.email
        })
        .where('id = :id', {id: req.session.user.id})
        .execute()
      const user = {
        id: req.session.user.id,
        username: req.body.username,
        email: req.body.email
      }
      req.session.user = user
      await req.session.save()
      res.json(user)
    }
    catch(e) {
      res.status(400).send('database error')
    }
  }
  else {
    res.status(404).send('')
  }
}

export default withIronSessionApiRoute(update, sessionOptions)