import {Component} from 'react'
import {motion} from 'framer-motion'

export default class FadeAnimation extends Component {
  render() {
  const variants = {
    hidden: {opacity: 0},
    enter: {opacity: 1},
    exit: {opacity: 0}
  }

    return (
      <motion.div variants={variants} initial="hidden" animate="enter" exit="exit" transition={{ type: 'linear', duration: .25 }}>
        {this.props.children}
      </motion.div>
    )
  }
}