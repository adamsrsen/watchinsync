import {NextApiRequest, NextApiResponse} from 'next'
import {sessionOptions} from '../../../lib/session'
import {withIronSessionApiRoute} from 'iron-session/next'

const login = async function(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'GET') {
    res.json({
      user: req.session.user
    })
  }
  else {
    res.status(404).send('')
  }
}

export default withIronSessionApiRoute(login, sessionOptions)