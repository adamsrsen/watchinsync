import {NextApiRequest} from 'next'
import { Server } from 'socket.io'
import {NextApiResponseSocketIO} from '../../objects/NextApiResponseSocketIO'
import * as http from 'http'

class RoomVariables {
  users: number = 0
}

export default async (req: NextApiRequest, res: NextApiResponseSocketIO) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server as http.Server, {
      path: '/api/socketio',
    })
    res.socket.server.io = io
    const rooms = new Map<string, RoomVariables>()

    io.on('connection', (socket) => {
      socket.on('join', (roomId) => {
        socket.join(roomId)
        io.in(roomId).emit('pause')
        if(!rooms.has(roomId)){
          rooms.set(roomId, new RoomVariables())
        }
        rooms.get(roomId).users++

        socket.on('play', (time) => {
          io.in(roomId).emit('seek', time)
          io.in(roomId).emit('play')
        })
        socket.on('pause', (time) => {
          io.in(roomId).emit('seek', time)
          io.in(roomId).emit('pause')
        })
        socket.on('seek', (time) => {
          io.in(roomId).emit('seek', time)
        })
        socket.on('playback_rate', (playbackRate) => {
          io.in(roomId).emit('playback_rate', playbackRate)
        })
      })

      socket.on('disconnecting', () => {
        for(const roomId of socket.rooms) {
          if(rooms.has(roomId)) {
            const room = rooms.get(roomId)
            if(--room.users === 0){
              rooms.delete(roomId)
            }
          }
        }
      })
    })
  }

  res.end()
}
