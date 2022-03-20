import {Component} from 'react'
import styles from './Player.module.scss'

export default class Player extends Component {
  render() {
    return (
      <div className={styles.player}>
        <p>NO VIDEO</p>
      </div>
    )
  }
}