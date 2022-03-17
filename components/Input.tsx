import {Component} from 'react'
import styles from './Input.module.scss'

export default class Input extends Component {
  props: {
    type: string
    placeholder: string
  }

  render() {
    return (
      <input className={styles.input} type={this.props.type} placeholder={this.props.placeholder}/>
    )
  }
}