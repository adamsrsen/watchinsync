import {Component} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Header from '../../components/Header'
import User from '../../objects/User'
import Container from '../../components/Container'
import List from '../../components/List'
import Item from '../../components/Item'
import Button, {ButtonSize, ButtonWidth} from '../../components/Button'
import styles from '../../styles/Room.module.scss'

export default class MyRooms extends Component {
  props: {
    user: User
    rooms: [{
      id: string
      name: string
    }]
  }

  render() {
    return (
      <div>
        <Head>
          <title>Browse rooms - WatchInSync</title>
          <link rel="icon" href="/favicon.ico"/>
        </Head>

        <Header user={this.props.user} />
        <Container>
          <h2 className="title">Browse rooms</h2>
          <List>
            {this.props.rooms?.map((room) => (
              <Item key={room.id}>
                <div className={styles.room}>
                  <span>{room.name}</span>
                  <Button size={ButtonSize.small} width={ButtonWidth.normal} href={`/room/${room.id}`}>
                    <b>JOIN</b>
                  </Button>
                </div>
              </Item>
            )) || (
              <Item>
                <p className="center">
                  You haven't joined any rooms yet, <Link href="/rooms/page/1"><a className="link">browse public rooms</a></Link> or <Link href="/room/create"><a className="link">create one</a></Link>
                </p>
              </Item>
            )}
          </List>
        </Container>
      </div>
    )
  }
}
