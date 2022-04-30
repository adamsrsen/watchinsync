import {Component, ReactNode} from 'react'
import styles from './Tabs.module.scss'
import FadeAnimation from './FadeAnimation'
import {AnimatePresence} from 'framer-motion'

export class Tab {
  title: string
  content: ReactNode

  constructor({title, content}) {
    this.title = title
    this.content = content
  }

  renderTab() {
    return this.title
  }

  renderContent() {
    return (
      <FadeAnimation key={this.title}>
        {this.content}
      </FadeAnimation>
    )
  }
}

export default class Tabs extends Component {
  props: {
    tabs: Tab[]
  }

  state: {
    active: number
  } = {
    active: 0
  }

  render() {
    const tab_width = 100 / this.props.tabs.length
    return (
      <div className={styles['tab-panel']}>
        <div className={styles['tab-container']}>
          <div className={styles.tabs}>
            {this.props.tabs.map((tab,index) => (
              <div className={styles['tab']} style={{width: `${tab_width}%`}} onClick={() => this.setState({active: index})} key={index}>
                {tab.renderTab()}
              </div>
            ))}
          </div>
          <div className={styles['ink-bar']} style={{width: `${tab_width}%`, left: `${tab_width * this.state.active}%`}} />
        </div>
        <div className={styles.content}>
          <AnimatePresence exitBeforeEnter>
            {this.props.tabs[this.state.active].renderContent()}
          </AnimatePresence>
        </div>
      </div>
    )
  }
}