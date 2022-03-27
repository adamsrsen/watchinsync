import {Component, MouseEventHandler, ReactNode} from 'react'
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

interface Props {
  size: ButtonSize,
  width: ButtonWidth,
  href?: string,
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export default class Button extends Component<Props> {
  render() {
    return this.props.href ? (
      <Link href={this.props.href}>
        <a className={[styles.button, this.props.size, this.props.width].join(' ')}>
          {this.props.children}
        </a>
      </Link>
    ) : (
      <button className={[styles.button, this.props.size, this.props.width].join(' ')} onClick={this.props.onClick}>
        {this.props.children}
      </button>
    )
  }
}