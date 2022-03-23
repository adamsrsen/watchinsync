import {Component} from 'react'
import styles from './Chat.module.scss'
import Room from '../objects/Room'

interface Props {
  room: Room
}

export default class Chat extends Component<Props> {
  render() {
    return (
      <h2>Work in progress...</h2>
    )
  }
}