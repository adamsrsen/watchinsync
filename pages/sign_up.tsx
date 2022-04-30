import {Component} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import User from '../objects/User'
import CenteredContent from '../components/CenteredContent'
import Input from '../components/Input'
import Button, {ButtonColor, ButtonSize, ButtonWidth} from '../components/Button'
import axios from 'axios'
import {NextRouter, withRouter} from 'next/router'
import {toast} from 'react-hot-toast'
import {
  checkEmail,
  checkPassword,
  checkPasswords,
  checkUsername,
  passwordErrorMessage
} from '../lib/verify'
import {preventDefault} from '../lib/util'
import FadeAnimation from '../components/FadeAnimation'

interface Props {
  user: User
  setUser: Function
  router: NextRouter
}

class SignUp extends Component<Props> {
  state: {
    username: string
    email: string
    password: string
    passwordRepeat: string
    forceError: boolean
  }

  constructor(props) {
    super(props)

    this.state = {
      username: '',
      email: '',
      password: '',
      passwordRepeat: '',
      forceError: false
    }
  }

  signUp() {
    if(checkUsername(this.state.username) && checkEmail(this.state.email) && checkPassword(this.state.password) && checkPasswords(this.state.password, this.state.passwordRepeat)){
      toast.promise(axios.post('/api/user/create', this.state), {
        loading: 'Signing up...',
        success: () => {
          this.props.router.push('/sign_in')
          return 'Successfully signed up'
        },
        error: 'Error occurred please try again later'
      })
    }
    else {
      toast.error('There are errors in sign up form')
      this.setState({
        forceError: true
      })
    }
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
        <FadeAnimation>
          <CenteredContent width={600}>
            <form onSubmit={preventDefault(() => this.signUp())}>
              <Input
                type="text"
                placeholder="Username"
                value={this.state.username}
                error={checkUsername(this.state.username) ? '' : 'Username is required field'}
                forceError={this.state.forceError}
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
              <Input
                type="password"
                placeholder="Password"
                value={this.state.password}
                error={passwordErrorMessage(this.state.password)}
                forceError={this.state.forceError}
                onChange={({target}) => this.setState({password: target.value})}
              />
              <Input
                type="password"
                placeholder="Repeat password"
                value={this.state.passwordRepeat}
                error={checkPasswords(this.state.password, this.state.passwordRepeat) ? '' : 'Passwords are not equal'}
                forceError={this.state.forceError}
                onChange={({target}) => this.setState({passwordRepeat: target.value})}
              />
              <Button size={ButtonSize.small} width={ButtonWidth.fullwidth} color={ButtonColor.primary}>
                <b>SIGN UP</b>
              </Button>
            </form>
            <p>Do you already have account? <Link href="/sign_in"><a className="link">Sign in</a></Link></p>
          </CenteredContent>
        </FadeAnimation>
      </div>
    )
  }
}

export default withRouter(SignUp)
