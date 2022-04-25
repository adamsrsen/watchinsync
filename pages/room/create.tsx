import {Component} from 'react'
import Head from 'next/head'
import {NextRouter, withRouter} from 'next/router'
import Header from '../../components/Header'
import CenteredContent from '../../components/CenteredContent'
import Button, {ButtonColor, ButtonSize, ButtonWidth} from '../../components/Button'
import User from '../../objects/User'
import Input from '../../components/Input'
import Checkbox from '../../components/Checkbox'
import axios from 'axios'
import {preventDefault, renderLoading} from '../../lib/util'
import {toast} from 'react-hot-toast'
import AnimatePage from '../../components/AnimatePage'

interface Props {
  user: User
  setUser: Function
  userLoaded: boolean
  router: NextRouter
}

class CreateRoom extends Component<Props> {
  state = {
    public: false,
    name: ''
  }

  createRoom() {
    toast.promise(axios.post('/api/room/create', {...this.state}), {
      loading: 'Creating room...',
      success: (res) => {
        this.props.router.push(`/room/${encodeURIComponent(res.data.id)}`)
        return 'Room successfully created'
      },
      error: 'Error occurred please try again later'
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

        <Header user={this.props.user} setUser={this.props.setUser}/>
        <AnimatePage>
          <CenteredContent width={600}>
            <form onSubmit={preventDefault(() => this.createRoom())}>
              <Input type="text" placeholder="Name" value={this.state.name} onChange={(e) => this.setState({name: e.target.value})} />
              <Checkbox checked={this.state.public} onChange={() => this.setState({public: !this.state.public})}>
                Public
              </Checkbox>
              <Button size={ButtonSize.small} width={ButtonWidth.fullwidth} color={ButtonColor.primary}>
                <b>CREATE ROOM</b>
              </Button>
            </form>
          </CenteredContent>
        </AnimatePage>
      </div>
    )
  }
}

export default withRouter(CreateRoom)