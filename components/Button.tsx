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

type ButtonColor = typeof ButtonWidth[keyof typeof ButtonWidth]
export const ButtonColor = {
  primary: styles.primary,
  secondary: styles.secondary,
} as const

interface Props {
  size: ButtonSize,
  width: ButtonWidth,
  color: ButtonColor,
  href?: string,
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export default class Button extends Component<Props> {
  render() {
    const classes = [styles.button, this.props.size, this.props.width, this.props.color]

    return this.props.href ? (
      <Link href={this.props.href}>
        <a className={classes.join(' ')}>
          {this.props.children}
        </a>
      </Link>
    ) : (
      <button className={classes.join(' ')} onClick={this.props.onClick}>
        {this.props.children}
      </button>
    )
  }
}