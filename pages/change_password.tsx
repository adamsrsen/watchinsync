import {Component} from 'react'
import Head from 'next/head'
import Header from '../components/Header'
import CenteredContent from '../components/CenteredContent'
import Input from '../components/Input'
import Button, {ButtonSize, ButtonWidth} from '../components/Button'
import User from '../objects/User'
import {checkPassword, checkPasswords, passwordErrorMessage} from '../lib/verify'
import {preventDefault, renderLoading} from '../lib/util'
import {toast} from 'react-hot-toast'
import axios from 'axios'
import {Router, withRouter} from 'next/router'

interface Props {
  user: User
  userLoaded: boolean
  router: Router
}

class ChangePassword extends Component<Props> {
  state: {
    password: string
    newPassword: string
    newPasswordRepeat: string
    forceError: boolean
  }

  constructor(props) {
    super(props)

    this.state = {
      password: '',
      newPassword: '',
      newPasswordRepeat: '',
      forceError: false
    }
  }

  changePassword() {
    if(checkPassword(this.state.newPassword) && checkPasswords(this.state.newPassword, this.state.newPasswordRepeat)) {
      toast.promise(axios.post('/api/user/change_password', {password: this.state.password, newPassword: this.state.newPassword, newPasswordRepeat: this.state.newPasswordRepeat}), {
        loading: 'Changing password...',
        success: () => {
          this.props.router.push('/profile')
          return 'Password successfully changed'
        },
        error: 'Invalid password'
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
          <title>Change password - WatchInSync</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header user={this.props.user}/>
        <CenteredContent width={600}>
          <form onSubmit={preventDefault(() => this.changePassword())}>
            <Input
              type="password"
              placeholder="Current password"
              value={this.state.password}
              onChange={({target}) => this.setState({password: target.value})}
            />
            <Input
              type="password"
              placeholder="New password"
              value={this.state.newPassword}
              error={passwordErrorMessage(this.state.newPassword)}
              forceError={this.state.forceError}
              onChange={({target}) => this.setState({newPassword: target.value})}
            />
            <Input
              type="password"
              placeholder="Repeat password"
              value={this.state.newPasswordRepeat}
              error={checkPasswords(this.state.newPassword, this.state.newPasswordRepeat) ? '' : 'Passwords are not equal'}
              forceError={this.state.forceError}
              onChange={({target}) => this.setState({newPasswordRepeat: target.value})}
            />
            <Button size={ButtonSize.small} width={ButtonWidth.fullwidth}>
              <b>CHANGE PASSWORD</b>
            </Button>
          </form>
        </CenteredContent>
      </div>
    )
  }
}

export default withRouter(ChangePassword)