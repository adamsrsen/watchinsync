import {ChangeEventHandler, Component, ReactNode} from 'react'
import styles from './Checkbox.module.scss'

export default class Checkbox extends Component {
  props: {
    onChange: ChangeEventHandler<HTMLInputElement>
    checked: boolean
    children?: ReactNode
  }

  render() {
    const classes = [styles['checkbox-check']]
    if(this.props.checked) classes.push(styles.checked)
    return (
      <label className={styles.checkbox}>
        {this.props.children && <span>{this.props.children}</span>}
        <span className={classes.join(' ')}/>
        <input type="checkbox" onChange={this.props.onChange} checked={this.props.checked}/>
      </label>
    )
  }
}