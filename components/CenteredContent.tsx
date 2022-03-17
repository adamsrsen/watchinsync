import {Component} from 'react'
import styles from './CenteredContent.module.scss'

export default class CenteredContent extends Component {
  render() {
    return (
      <div className={styles.content}>
        {this.props.children}
      </div>
    )
  }
}