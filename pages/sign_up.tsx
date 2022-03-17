import {Component} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import User from '../objects/User'
import CenteredContent from '../components/CenteredContent'
import Input from '../components/Input'
import Button, {ButtonSize, ButtonWidth} from '../components/Button'

export default class SignUp extends Component {
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

        <Header  user={this.props.user}/>
        <CenteredContent>
          <form className="form">
            <Input type="text" placeholder="Username" />
            <Input type="text" placeholder="Email" />
            <Input type="password" placeholder="Password" />
            <Input type="password" placeholder="Repeat password" />
            <Button size={ButtonSize.small} width={ButtonWidth.fullwidth}>
              <b>SIGN UP</b>
            </Button>
          </form>
          <p>Do you already have account? <Link href="/sign_in"><a className="link">Sign in</a></Link></p>
        </CenteredContent>
      </div>
    )
  }
}
