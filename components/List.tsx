import {Component} from 'react'
import styles from './List.module.scss'

export default class List extends Component {
  render() {
    return (
      <ul className={styles.list}>
        {this.props.children}
      </ul>
    )
  }
}