import {decode, encode} from 'uuid-base64-ts'

export const decodeRoomId = (id) => {
  const roomId = decode(id)
  if(id !== encode(roomId)){
    throw Error()
  }

  return roomId
}