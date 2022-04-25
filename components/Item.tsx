import {Component} from 'react'
import {motion} from 'framer-motion'
import styles from './Item.module.scss'

interface Props {
  index: number
}

export default class Item extends Component<Props> {
  render() {
    const variants = {
      enter: (i) => ({
        opacity: 1,
        transition: {
          delay: i * 0.1
        }
      })
    }

    return (
      <motion.li
        className={styles.item}
        style={{
          opacity: 0
        }}
        animate="enter"
        variants={variants}
        custom={this.props.index}
      >
        {this.props.children}
      </motion.li>
    )
  }
}