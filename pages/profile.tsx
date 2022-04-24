import {Component} from 'react'
import Head from 'next/head'
import Header from '../components/Header'
import CenteredContent from '../components/CenteredContent'
import Input from '../components/Input'
import Button, {ButtonColor, ButtonSize, ButtonWidth} from '../components/Button'
import User from '../objects/User'
import Divider from '../components/Divider'
import {preventDefault, renderLoading} from '../lib/util'
import {checkEmail, checkUsername} from '../lib/verify'
import _ from 'lodash'
import {toast} from 'react-hot-toast'
import axios from 'axios'
import {Router, withRouter} from 'next/router'

interface Props {
  user: User
  setUser: Function
  userLoaded: boolean
  router: Router
}

class Profile extends Component<Props> {
  state: {
    username: string
    email: string
    forceError: boolean
  }

  constructor(props) {
    super(props)

    this.state = {
      username: this.props?.user?.username || '',
      email: this.props?.user?.email || '',
      forceError: false
    }
  }

  componentDidUpdate(prevProps) {
    if(!_.isEqual(this.props, prevProps)){
      this.setState({
        username: this.props?.user?.username || '',
        email: this.props?.user?.email || ''
      })
    }
  }

  save() {
    if(checkUsername(this.state.username) && checkEmail(this.state.email)) {
      toast.promise(axios.post('/api/user/update', this.state), {
        loading: 'Saving changes...',
        success: ({data}) => {
          this.props.setUser(data)
          return 'Changes successfully saved'
        },
        error: 'Error occurred please try again later'
      })
    }
    else {
      toast.error('There are errors in form')
      this.setState({
        forceError: true
      })
    }
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
          <title>Profile - WatchInSync</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header user={this.props.user} setUser={this.props.setUser}/>
        <CenteredContent width={600}>
          <form onSubmit={preventDefault(() => this.save())}>
            <Input
              type="text"
              placeholder="Username"
              value={this.state.username}
              error={checkUsername(this.state.username) ? '' : 'Username is required field'}
              onChange={({target}) => this.setState({username: target.value})}
            />
            <Input
              type="text"
              placeholder="Email"
              value={this.state.email}
              error={checkEmail(this.state.email) ? '' : 'Invalid email'}
              forceError={this.state.forceError}
              onChange={({target}) => this.setState({email: target.value})}
            />
            <Button size={ButtonSize.small} width={ButtonWidth.fullwidth} color={ButtonColor.primary}>
              <b>SAVE</b>
            </Button>
          </form>
          <Divider />
          <Button size={ButtonSize.small} width={ButtonWidth.fullwidth} color={ButtonColor.primary} href="/change_password">
            <b>CHANGE PASSWORD</b>
          </Button>
        </CenteredContent>
      </div>
    )
  }
}

export default withRouter(Profile)