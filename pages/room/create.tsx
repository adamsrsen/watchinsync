import {Component} from 'react'
import Head from 'next/head'
import {NextRouter, withRouter} from 'next/router'
import Header from '../../components/Header'
import CenteredContent from '../../components/CenteredContent'
import Button, {ButtonSize, ButtonWidth} from '../../components/Button'
import User from '../../objects/User'
import Input from '../../components/Input'
import Checkbox from '../../components/Checkbox'
import axios from 'axios'

interface Props {
  user: User
  router: NextRouter
}

class CreateRoom extends Component<Props> {
  state = {
    public: false,
    name: ''
  }

  createRoom() {
    axios.post('/api/room/create', {...this.state}).then((res) => {
      this.props.router.push(`/room/${encodeURIComponent(res.data.id)}`)
    })
  }

  render() {
    return (
      <div>
        <Head>
          <title>Create room - WatchInSync</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header user={this.props.user}/>
        <CenteredContent width={600}>
          <Input type="text" placeholder="Name" value={this.state.name} onChange={(e) => this.setState({name: e.target.value})} />
          <Checkbox checked={this.state.public} onChange={() => this.setState({public: !this.state.public})}>
            Public
          </Checkbox>
          <Button size={ButtonSize.small} width={ButtonWidth.fullwidth} onClick={() => this.createRoom()}>
            <b>CREATE ROOM</b>
          </Button>
        </CenteredContent>
      </div>
    )
  }
}

export default withRouter(CreateRoom)