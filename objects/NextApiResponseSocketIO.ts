import { Server as HttpServer, OutgoingMessage } from 'http'
import { NextApiResponse } from 'next'
import { Server as SocketIOServer } from 'socket.io'

export type NextApiResponseSocketIO = NextApiResponse & {
  socket: OutgoingMessage['socket'] & {
    server: HttpServer & {
      io: SocketIOServer
    }
  }
}