import {Component} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import User from '../objects/User'
import styles from './Header.module.scss'

export default class Header extends Component {
  props: {
    user?: User
  }

  render() {
    return (
      <div className={styles.header}>
        <Link href="/">
          <a className={[styles['header-link'], styles['header-group']].join(' ')}>
            <div>
              <Image src="/watchinsync.png" alt="WatchInSync logo" width={100} height={100}/>
            </div>
            <h1>WatchInSync</h1>
          </a>
        </Link>
        <div className={styles['header-group']}>
          {this.props.user ? (
            <>
              <Link href="/profile">
                <a className={[styles['header-link'], styles['header-text']].join(' ')}>
                  {this.props.user.username}
                </a>
              </Link>
              <Link href="/api/user/logout">
                <a className={[styles['header-link'], styles['header-text']].join(' ')}>
                  Sign out
                </a>
              </Link>
            </>
          ) : (
            <>
              <Link href="/sign_in">
                <a className={[styles['header-link'], styles['header-text']].join(' ')}>
                  Sign in
                </a>
              </Link>
              <Link href="/sign_up">
                <a className={[styles['header-link'], styles['header-text']].join(' ')}>
                  Sign up
                </a>
              </Link>
            </>
          )}
        </div>
      </div>
    )
  }
}