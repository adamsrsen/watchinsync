import User from './User'

export default class Message {
  user: User
  texts: {
    text: string,
    date: Date
  }[]
}