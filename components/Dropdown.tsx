import {Component, MouseEventHandler, ReactNode} from 'react'
import Link from 'next/link'
import styles from './Dropdown.module.scss'
import List from './List'
import Item from './Item'

export default class Dropdown extends Component {
  state: {
    opened: boolean,
    clicked: boolean
  }

  props: {
    options: {
      title: string,
      href?: string,
      onClick?: MouseEventHandler<HTMLDivElement>
    }[]
    children: ReactNode
  }

  constructor(props) {
    super(props)

    this.state = {
      opened: false,
      clicked: false
    }
  }

  componentDidMount() {
    document.addEventListener('click',() => this.close())
  }

  toggle(event) {
    this.setState({opened: !this.state.opened, clicked: true})
  }

  close() {
    const update = {
      clicked: false,
      opened: this.state.opened
    }
    if(!this.state.clicked){
      update.opened = false
    }

    this.setState(update)
  }

  componentWillUnmount() {
    document.removeEventListener('click', () => this.close())
  }


  render() {
    return (
      <div className={styles.dropdown} onClick={(e) => this.toggle(e)}>
        {this.props.children}
        <div className={`${styles['dropdown-items']}${this.state.opened ? ` ${styles['opened']}` : ''}`}>
          <List>
            {this.props.options.map((option, index) => (
              <Item key={index}>
                <div onClick={option.onClick}>
                  {option.href ? (
                    <Link href={option.href}>
                      <a>
                        {option.title}
                      </a>
                    </Link>
                  ) : option.title}
                </div>
              </Item>
            ))}
          </List>
        </div>
      </div>
    )
  }
}