import {Component} from 'react'
import Head from 'next/head'
import Header from '../components/Header'
import CenteredContent from '../components/CenteredContent'
import Input from '../components/Input'
import Button, {ButtonSize, ButtonWidth} from '../components/Button'
import User from '../objects/User'
import Divider from '../components/Divider'

export default class ChangePassword extends Component {
  props: {
    user: User
  }

  render() {
    return (
      <div>
        <Head>
          <title>Change password - WatchInSync</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header user={this.props.user}/>
        <CenteredContent width={600}>
          <Input type="password" placeholder="Current password" />
          <Input type="password" placeholder="New password" />
          <Input type="password" placeholder="Repeat password" />
          <Button size={ButtonSize.small} width={ButtonWidth.fullwidth}>
            <b>CHANGE PASSWORD</b>
          </Button>
        </CenteredContent>
      </div>
    )
  }
}