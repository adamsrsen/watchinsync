import {Component} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import User from '../objects/User'
import CenteredContent from '../components/CenteredContent'
import Input from '../components/Input'
import Button, {ButtonColor, ButtonSize, ButtonWidth} from '../components/Button'
import {toast} from 'react-hot-toast'
import axios from 'axios'
import {Router, withRouter} from 'next/router'
import {preventDefault, renderLoading} from '../lib/util'

interface Props {
  user: User
  setUser: Function
  router: Router
}

class SignIn extends Component<Props> {
  state: {
    email: string
    password: string
  }

  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
    }
  }

  login() {
    toast.promise(axios.post('/api/user/login', {email: this.state.email, password: this.state.password}), {
      loading: 'Signing in...',
      success: ({data}) => {
        this.props.setUser(data)
        return 'Successfully signed in'
      },
      error: 'Invalid credentials'
    })
  }

  render() {
    if(this.props.user) {
      this.props.router.push('/')
    }

    return (
      <div>
        <Head>
          <title>Sign in - WatchInSync</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header user={this.props.user} setUser={this.props.setUser} />
        <CenteredContent width={600}>
          <form onSubmit={preventDefault(() => this.login())}>
            <Input
              type="text"
              placeholder="Email"
              value={this.state.email}
              onChange={({target}) => this.setState({email: target.value})}
            />
            <Input
              type="password"
              placeholder="Password"
              value={this.state.password}
              onChange={({target}) => this.setState({password: target.value})}
            />
            <Button size={ButtonSize.small} width={ButtonWidth.fullwidth} color={ButtonColor.primary}>
              <b>SIGN IN</b>
            </Button>
          </form>
          <p>Don&#39;t you have account? <Link href="/sign_up"><a className="link">Sign up</a></Link></p>
        </CenteredContent>
      </div>
    )
  }
}

export default withRouter(SignIn)
