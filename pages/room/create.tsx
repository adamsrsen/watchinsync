import {Component} from 'react'
import Head from 'next/head'
import Header from '../../components/Header'
import CenteredContent from '../../components/CenteredContent'
import Button, {ButtonSize, ButtonWidth} from '../../components/Button'
import Divider from '../../components/Divider'
import Link from 'next/link'
import User from '../../objects/User'
import Input from '../../components/Input'
import Checkbox from '../../components/Checkbox'

export default class CreateRoom extends Component {
  props: {
    user: User
  }

  state = {
    public: false
  }

  render() {
    console.log(this.state)
    return (
      <div>
        <Head>
          <title>Home - WatchInSync</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header user={this.props.user}/>
        <CenteredContent width={600}>
          <Input type="text" placeholder="Name" />
          <Checkbox checked={this.state.public} onChange={() => this.setState({public: !this.state.public})}>
            Public
          </Checkbox>
          <Button size={ButtonSize.small} width={ButtonWidth.fullwidth}>
            <b>CREATE ROOM</b>
          </Button>
        </CenteredContent>
      </div>
    )
  }
}