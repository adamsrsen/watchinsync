import {Component, MouseEventHandler, ReactNode} from 'react'
import {motion} from 'framer-motion'
import Link from 'next/link'
import styles from './Dropdown.module.scss'
import List from './List'
import Item from './Item'

interface Props {
  options: {
    title: string,
    href?: string,
    onClick?: MouseEventHandler<HTMLDivElement>
  }[]
  children: ReactNode
}

export default class Dropdown extends Component<Props> {
  state: {
    opened: boolean,
    clicked: boolean
  }
  listener: any

  constructor(props) {
    super(props)

    this.state = {
      opened: false,
      clicked: false
    }
  }

  componentDidMount() {
    this.listener = () => this.close()
    document.addEventListener('click', this.listener)
  }

  toggle() {
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
    document.removeEventListener('click', this.listener)
  }


  render() {
    return (
      <div className={styles.dropdown} onClick={() => this.toggle()}>
        {this.props.children}
        <motion.div
          initial={'close'}
          animate={this.state.opened ? 'open' : 'close'}
          variants={{
            open: {
              display: 'block',
            },
            close: {
              display: 'none',
              transition: {
                when: 'afterChildren'
              }
            }
          }}
        >
          <motion.div
            className={styles['dropdown-items']}
            variants={{
              open: {
                opacity: 1
              },
              close: {
                opacity: 0
              }
            }}
            transition={{
              duration: .1
            }}
          >
            <List>
              {this.props.options.map((option, index) => (
                <Item key={index} index={index}>
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
          </motion.div>
        </motion.div>
      </div>
    )
  }
}