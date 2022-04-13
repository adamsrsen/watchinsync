import {NextApiRequest, NextApiResponse} from 'next'
import bodyParser from 'body-parser'
import {promisify} from 'util'
import getConnection from '../../../lib/db'
import Users from '../../../entity/Users'
import bcrypt from 'bcrypt'
import {checkEmail, checkPassword, checkPasswords, checkUsername} from '../../../lib/util'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'POST') {
    await promisify(bodyParser.urlencoded())(req,res)

    if(!checkUsername(req.body?.username)){
      return res.status(400).send('username is not specified')
    }

    if(!checkEmail(req.body?.email)){
      return res.status(400).send('email is invalid')
    }

    if(!checkPassword(req.body?.password)){
      return res.status(400).send('password is invalid')
    }

    if(!checkPasswords(req.body?.password, req.body?.passwordRepeat)){
      return res.status(400).send('passwords does not match')
    }

    const connection = await getConnection()
    const hashed_password = await bcrypt.hash(req.body.password, 10)
    try {
      await connection
        .createQueryBuilder()
        .insert()
        .into<Users>('Users')
        .values({
          username: req.body.username,
          email: req.body.email,
          password: hashed_password
        })
        .execute()
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