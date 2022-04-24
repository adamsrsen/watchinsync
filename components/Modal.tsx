import {Component, MouseEventHandler} from 'react'
import {motion} from 'framer-motion'
import styles from './Modal.module.scss'
import CenteredContent from './CenteredContent'

interface Props {
  width?: number
  close: MouseEventHandler<HTMLDivElement>
  open: boolean
}

export default class Modal extends Component<Props> {

  render() {
    return (
      <motion.div
        className={styles.modal}
        initial={'close'}
        animate={this.props.open ? 'open' : 'close'}
        variants={{
          open: {
            display: 'block'
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
          variants={{
            open: {
              opacity: 1
            },
            close: {
              opacity: 0
            }
          }}
        >
          <CenteredContent width={this.props.width} height="100vh">
            <motion.div
              className={styles['modal-content']}
              variants={{
                open: {
                  scale: 1
                },
                close: {
                  scale: 0
                }
              }}
            >
              {this.props.children}
            </motion.div>
          </CenteredContent>
          <div className={styles.backdrop} onClick={this.props.close}/>
        </motion.div>
      </motion.div>
    )
  }
}