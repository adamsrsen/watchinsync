import {Component} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import User from '../objects/User'
import CenteredContent from '../components/CenteredContent'
import Input from '../components/Input'
import Button, {ButtonSize, ButtonWidth} from '../components/Button'

export default class SignIn extends Component {
  props: {
    user: User
  }

  render() {
    return (
      <div>
        <Head>
          <title>Sign in - WatchInSync</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header user={this.props.user}/>
        <CenteredContent width={600}>
          <Input type="text" placeholder="Email" />
          <Input type="password" placeholder="Password" />
          <Button size={ButtonSize.small} width={ButtonWidth.fullwidth}>
            <b>SIGN IN</b>
          </Button>
          <p>Don&#39;t you have account? <Link href="/sign_up"><a className="link">Sign up</a></Link></p>
        </CenteredContent>
      </div>
    )
  }
}
