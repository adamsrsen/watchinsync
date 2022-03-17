import {Component, ReactNode} from 'react'
import Link from 'next/link'
import styles from './Button.module.scss'

type ButtonSize = typeof ButtonSize[keyof typeof ButtonSize]
export const ButtonSize = {
  small: styles['button-small'],
  large: styles['button-large'],
} as const

type ButtonWidth = typeof ButtonWidth[keyof typeof ButtonWidth]
export const ButtonWidth = {
  normal: '',
  fullwidth: styles['button-fullwidth'],
} as const

export default class Button extends Component {
  props: {
    size: ButtonSize,
    width: ButtonWidth,
    href?: string,
    children: ReactNode
  }

  render() {
    return this.props.href ? (
      <Link href={this.props.href}>
        <a className={[styles.button, this.props.size, this.props.width].join(' ')}>
          {this.props.children}
        </a>
      </Link>
    ) : (
      <button className={[styles.button, this.props.size, this.props.width].join(' ')}>
        {this.props.children}
      </button>
    )
  }
}