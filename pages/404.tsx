import {Component} from 'react'
import Head from 'next/head'
import CenteredContent from '../components/CenteredContent'
import Header from '../components/Header'
import User from '../objects/User'

export default class Error404 extends Component {
  props: {
    user: User
  }

  render() {
    return (
      <div>
        <Head>
          <title>404: Page not found - WatchInSync</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header user={this.props.user} />
        <CenteredContent>
          <h2 className="title">404</h2>
          <p>Page not found</p>
        </CenteredContent>
      </div>
    )
  }
}
