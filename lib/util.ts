import {decode, encode} from 'uuid-base64-ts'

export const decodeRoomId = (id) => {
  const roomId = decode(id)
  if(id !== encode(roomId)){
    throw Error()
  }

  return roomId
}

export const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
}