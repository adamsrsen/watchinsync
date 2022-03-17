import {Component, ReactNode} from 'react'
import styles from './Container.module.scss'

export default class Container extends Component {
  props: {
    width?: number
    children: ReactNode
  }

  render() {
    return (
      <div className={styles.container}  style={this.props.width && {
        maxWidth: `${this.props.width}px`
      }}>
        {this.props.children}
      </div>
    )
  }
}