import {Component} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import User from '../objects/User'
import CenteredContent from '../components/CenteredContent'
import Input from '../components/Input'
import Button, {ButtonSize, ButtonWidth} from '../components/Button'
import axios from 'axios'
import {NextRouter, withRouter} from 'next/router'
import {toast} from 'react-hot-toast'
import {preventDefault} from '../lib/util'

const MIN_PASSWORD_LEN = 8
const MAX_PASSWORD_LEN = 24

interface Props {
  user: User
  router: NextRouter
}

class SignUp extends Component<Props> {
  state: {
    username: string
    email: string
    password: string
    passwordRepeat: string
  }

  constructor(props) {
    super(props)

    this.state = {
      username: '',
      email: '',
      password: '',
      passwordRepeat: ''
    }
  }

  checkUsername() {
    return this.state.username.length > 0
  }

  checkEmail() {
    return this.state.email.match(/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/)
  }

  checkShortPassword() {
    return this.state.password.length >= MIN_PASSWORD_LEN
  }

  checkLongPassword() {
    return this.state.password.length <= MAX_PASSWORD_LEN
  }

  passwordErrorMessage() {
    if(!this.checkShortPassword()) {
      return `Password is too short minimum number of characters is ${MIN_PASSWORD_LEN}`
    }
    if(!this.checkLongPassword()) {
      return `Password is too long maximum number of characters is ${MAX_PASSWORD_LEN}`
    }
  }

  checkPassword() {
    return this.checkShortPassword() && this.checkLongPassword()
  }

  checkPasswords() {
    return this.state.password === this.state.passwordRepeat
  }

  signUp() {
    if(this.checkUsername() && this.checkShortPassword() && this.checkPassword() && this.checkPasswords()){
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
    }
  }

  render() {
    return (
      <div>
        <Head>
          <title>Sign in - WatchInSync</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header user={this.props.user}/>
        <CenteredContent width={600}>
          <form onSubmit={preventDefault(() => this.signUp())}>
            <Input
              type="text"
              placeholder="Username"
              value={this.state.username}
              error={this.checkUsername() ? '' : 'Username is required field'}
              onChange={({target}) => this.setState({username: target.value})}
            />
            <Input
              type="text"
              placeholder="Email"
              value={this.state.email}
              error={this.checkEmail() ? '' : 'Invalid email'}
              onChange={({target}) => this.setState({email: target.value})}
            />
            <Input
              type="password"
              placeholder="Password"
              value={this.state.password}
              error={this.passwordErrorMessage()}
              onChange={({target}) => this.setState({password: target.value})}
            />
            <Input
              type="password"
              placeholder="Repeat password"
              value={this.state.passwordRepeat}
              error={this.checkPasswords() ? '' : 'Passwords are not equal'}
              onChange={({target}) => this.setState({passwordRepeat: target.value})}
            />
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

export default withRouter(SignUp)
