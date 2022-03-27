import {NextApiRequest} from 'next'
import { Server } from 'socket.io'
import {NextApiResponseSocketIO} from '../../objects/NextApiResponseSocketIO'
import * as http from 'http'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async (req: NextApiRequest, res: NextApiResponseSocketIO) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server as http.Server, {
      path: '/api/socketio',
    })
    res.socket.server.io = io

    io.on('connection', (socket) => {
      socket.on('join', (roomId) => {
        console.log('joined room ' + roomId)
        socket.join(roomId)
      })
    })
  }

  res.end()
}
