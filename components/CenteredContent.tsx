import {Component, ReactNode} from 'react'
import styles from './CenteredContent.module.scss'
import Container from './Container'

export default class CenteredContent extends Component {
  props: {
    width?: number
    children: ReactNode
  }

  render() {
    return (
      <Container width={this.props.width}>
        <div className={styles.content}>
          {this.props.children}
        </div>
      </Container>
    )
  }
}