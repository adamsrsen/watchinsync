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
import {preventDefault, renderLoading} from '../../lib/util'

interface Props {
  user: User
  userLoaded: boolean
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
    if(!this.props.userLoaded) {
      return renderLoading()
    }

    if(!this.props.user) {
      this.props.router.push('/sign_in')
      return renderLoading()
    }

    return (
      <div>
        <Head>
          <title>Create room - WatchInSync</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header user={this.props.user}/>
        <CenteredContent width={600}>
          <form onSubmit={preventDefault(() => this.createRoom())}>
            <Input type="text" placeholder="Name" value={this.state.name} onChange={(e) => this.setState({name: e.target.value})} />
            <Checkbox checked={this.state.public} onChange={() => this.setState({public: !this.state.public})}>
              Public
            </Checkbox>
            <Button size={ButtonSize.small} width={ButtonWidth.fullwidth}>
              <b>CREATE ROOM</b>
            </Button>
          </form>
        </CenteredContent>
      </div>
    )
  }
}

export default withRouter(CreateRoom)