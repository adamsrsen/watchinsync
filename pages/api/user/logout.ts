import {NextApiRequest, NextApiResponse} from 'next'
import {sessionOptions} from '../../../lib/session'
import {withIronSessionApiRoute} from 'iron-session/next'

const login = async function(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'GET') {
    req.session.destroy()
    res.redirect('/')
  }
  else {
    res.status(405).end()
  }
}

export default withIronSessionApiRoute(login, sessionOptions)