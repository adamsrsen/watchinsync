import {ChangeEventHandler, Component} from 'react'
import styles from './Input.module.scss'

interface Props {
  type: string
  placeholder: string
  value?: string
  error?: string
  forceError?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
}

export default class Input extends Component<Props> {
  state: {
    used: boolean
  }

  constructor(props) {
    super(props)

    this.state = {
      used: false
    }
  }


  render() {
    return (
      <>
        <input
          className={styles.input}
          type={this.props.type}
          placeholder={this.props.placeholder}
          value={this.props.value}
          onChange={this.props.onChange}
          onBlur={() => this.setState({used: true})}
        />
        {this.props.error && (this.state.used || this.props.forceError) && (
          <p className="error">{this.props.error}</p>
        )}
      </>
    )
  }
}