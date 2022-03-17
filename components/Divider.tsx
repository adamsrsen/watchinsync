import {Component} from 'react'
import styles from './Divider.module.scss'

export default class Divider extends Component {
  render() {
    return (
      <span className={styles.divider} />
    )
  }
}