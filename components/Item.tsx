import {Component} from 'react'
import styles from './Item.module.scss'

export default class Item extends Component {
  render() {
    return (
      <li className={styles.item}>
        {this.props.children}
      </li>
    )
  }
}