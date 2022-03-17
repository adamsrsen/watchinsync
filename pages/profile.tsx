import {Component} from 'react'
import Head from 'next/head'
import Header from '../components/Header'
import CenteredContent from '../components/CenteredContent'
import Input from '../components/Input'
import Button, {ButtonSize, ButtonWidth} from '../components/Button'
import User from '../objects/User'
import Divider from '../components/Divider'

export default class Profile extends Component {
  props: {
    user: User
  }

  render() {
    return (
      <div>
        <Head>
          <title>Profile - WatchInSync</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header user={this.props.user}/>
        <CenteredContent width={600}>
          <Input type="text" placeholder="Username" />
          <Input type="text" placeholder="Email" />
          <Button size={ButtonSize.small} width={ButtonWidth.fullwidth}>
            <b>SAVE</b>
          </Button>
          <Divider />
          <Button size={ButtonSize.small} width={ButtonWidth.fullwidth} href="/change_password">
            <b>CHANGE PASSWORD</b>
          </Button>
        </CenteredContent>
      </div>
    )
  }
}