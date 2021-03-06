import {Component} from 'react'
import Head from 'next/head'
import CenteredContent from '../components/CenteredContent'
import Header from '../components/Header'
import User from '../objects/User'
import FadeAnimation from '../components/FadeAnimation'

interface Props {
  user: User
  setUser: Function
}

export default class Error404 extends Component<Props> {

  render() {
    return (
      <div>
        <Head>
          <title>404: Page not found - WatchInSync</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header user={this.props.user} setUser={this.props.setUser} />
        <FadeAnimation>
          <CenteredContent>
            <h2 className="title">404</h2>
            <p>Page not found</p>
          </CenteredContent>
        </FadeAnimation>
      </div>
    )
  }
}
