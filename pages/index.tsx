import {Component} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import User from '../objects/User'
import CenteredContent from '../components/CenteredContent'
import Button, {ButtonSize, ButtonWidth} from '../components/Button'
import Divider from '../components/Divider'

export default class Home extends Component {
  props: {
    user: User
  }

  render() {
    return (
      <div>
        <Head>
          <title>Home - WatchInSync</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header user={this.props.user} />

        <CenteredContent>
          {this.props.user ? (
            <>
              <Button size={ButtonSize.large} width={ButtonWidth.fullwidth} href="/room/create">
                <b>CREATE ROOM</b>
              </Button>
              <Divider />
            </>
          ) : (
            <p>
              If you want to create your own rooms <Link href="/sign_up"><a className="link">sign up</a></Link>
            </p>
          )}
          <Button size={ButtonSize.large} width={ButtonWidth.fullwidth} href="/rooms">
            <b>BROWSE ROOMS</b>
          </Button>
        </CenteredContent>
      </div>
    )
  }
}
