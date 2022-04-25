import {Component} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import User from '../objects/User'
import CenteredContent from '../components/CenteredContent'
import Button, {ButtonColor, ButtonSize, ButtonWidth} from '../components/Button'
import Divider from '../components/Divider'
import AnimatePage from '../components/AnimatePage'

interface Props {
  user: User
  setUser: Function
}

export default class Home extends Component<Props> {
  render() {
    return (
      <div>
        <Head>
          <title>Home - WatchInSync</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header user={this.props.user} setUser={this.props.setUser} />

        <AnimatePage>
          <CenteredContent>
            {this.props.user ? (
              <>
                <Button size={ButtonSize.large} width={ButtonWidth.fullwidth} color={ButtonColor.primary} href="/room/create">
                  <b>CREATE ROOM</b>
                </Button>
                <Divider />
              </>
            ) : (
              <p>
                If you want to create your own rooms <Link href="/sign_up"><a className="link">sign up</a></Link>
              </p>
            )}
            <Button size={ButtonSize.large} width={ButtonWidth.fullwidth} color={ButtonColor.primary} href="/rooms/page/1">
              <b>BROWSE ROOMS</b>
            </Button>
            {this.props.user && (
              <>
                <Divider />
                <Button size={ButtonSize.large} width={ButtonWidth.fullwidth} color={ButtonColor.primary} href="/rooms/my/1">
                  <b>MY ROOMS</b>
                </Button>
              </>
            )}
          </CenteredContent>
        </AnimatePage>
      </div>
    )
  }
}
