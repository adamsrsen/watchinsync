import {Component} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Header from '../../../components/Header'
import User from '../../../objects/User'
import Container from '../../../components/Container'
import List from '../../../components/List'
import Item from '../../../components/Item'
import Button, {ButtonSize, ButtonWidth} from '../../../components/Button'
import styles from '../../../styles/Rooms.module.scss'
import Input from '../../../components/Input'

export default class Rooms extends Component {
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
          <Input type="text" placeholder="Search..." />
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
                  There are no public rooms, so <Link href="/sign_up"><a className="link">sign up</a></Link> and create one
                </p>
              </Item>
            )}
          </List>
        </Container>
      </div>
    )
  }
}


export async function getStaticPaths() {
  return {
    paths: [
      {
        params: {
          page: ':page'
        }
      }
    ],
    fallback: true
  }
}

export async function getStaticProps({params}) {
  return {
    props: {
      rooms: [
        {
          id: '1',
          name: 'test1'
        },
        {
          id: '2',
          name: 'test2'
        }
      ]
    }
  }
}
