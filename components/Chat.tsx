import {Component} from 'react'
import styles from './Chat.module.scss'
import Room from '../objects/Room'
import Message from '../objects/Message'
import {preventDefault} from '../lib/util'
import Input from './Input'
import axios from 'axios'
import ScrollToBottom, {StateContext, FunctionContext} from 'react-scroll-to-bottom'
import Button, {ButtonColor, ButtonSize, ButtonWidth} from './Button'
import _ from 'lodash'

interface Props {
  room: Room
  messages: Message[]
  loadMessages: Function
}

export default class Chat extends Component<Props> {
  state: {
    message: string
  }

  constructor(props) {
    super(props)

    this.state = {
      message: ''
    }
  }

  sendMessage() {
    axios.post('/api/room/messages', {roomId: this.props.room.id, message: this.state.message}).then(() => this.setState({message: ''}))
  }

  render() {
    return (
      <div className={styles.chat}>
        <ScrollToBottom className={styles.messages} followButtonClassName={styles.hide}>
          <FunctionContext.Consumer>
            {({ scrollTo }) => (
              <StateContext.Consumer>
                {({ atStart, animating }) => (atStart && !animating && (() => this.props.loadMessages())())}
              </StateContext.Consumer>
            )}
          </FunctionContext.Consumer>
          {this.props?.messages?.map((message, index) => (
            <div key={index}>
              <p className={styles.user}>{message.user.username} <i className={styles.date}>{message.texts[0].date.toLocaleDateString()}</i></p>
              {message.texts.map((text, index) => (
                <div key={index} className={styles.message}>
                  <span className={styles.time}>{text.date.toLocaleTimeString()}</span>
                  <span>{text.text}</span>
                </div>
              ))}
            </div>
          ))}
          <FunctionContext.Consumer>
            {({ scrollToBottom }) => (
              <StateContext.Consumer>
                {({ sticky }) => (!sticky && (
                  <div className={styles.sticky}>
                    <Button size={ButtonSize.small} width={ButtonWidth.normal} color={ButtonColor.primary} onClick={() => scrollToBottom()}>Scroll back to bottom</Button>
                  </div>
                ))}
              </StateContext.Consumer>
            )}
          </FunctionContext.Consumer>
        </ScrollToBottom>
        <form className={styles.form} onSubmit={preventDefault(() => this.sendMessage())}>
          <Input type="text" placeholder="Message" value={this.state.message} onChange={({target}) => this.setState({message: target.value})} />
          <input type="submit" style={{display: 'none'}}/>
        </form>
      </div>
    )
  }
}