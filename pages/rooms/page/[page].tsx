import {Component} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Header from '../../../components/Header'
import User from '../../../objects/User'
import Container from '../../../components/Container'
import List from '../../../components/List'
import Item from '../../../components/Item'
import Button, {ButtonColor, ButtonSize, ButtonWidth} from '../../../components/Button'
import styles from '../../../styles/Rooms.module.scss'
import Input from '../../../components/Input'
import getConnection from '../../../lib/db'
import Rooms from '../../../entity/Rooms'
import Room from '../../../objects/Room'
import {encode} from 'uuid-base64-ts'
import {NextRouter, withRouter} from 'next/router'
import FadeAnimation from '../../../components/FadeAnimation'

interface Props {
  user: User
  setUser: Function
  rooms: Room[]
  pages: number
  router: NextRouter
}

class RoomsPage extends Component<Props> {
  renderRoomList() {
    if(this.props.router.isFallback) {
      return <h2 className="text-center">Loading...</h2>
    }

    return (
      <List>
        {this.props.pages ? this.props.rooms?.map((room, index) => (
          <Item key={room.id} index={index}>
            <div className={styles.room}>
              <span>{room.name}</span>
              <Button size={ButtonSize.small} width={ButtonWidth.normal} color={ButtonColor.primary} href={`/room/${encodeURIComponent(room.id)}`}>
                <b>JOIN</b>
              </Button>
            </div>
          </Item>
        )) : (
          <Item index={0}>
            <p className="center">
              There are no public rooms, so <Link href="/sign_up"><a className="link">sign up</a></Link> and create one
            </p>
          </Item>
        )}
      </List>
    )
  }

  render() {
    return (
      <div>
        <Head>
          <title>Browse rooms - WatchInSync</title>
          <link rel="icon" href="/favicon.ico"/>
        </Head>

        <Header user={this.props.user} setUser={this.props.setUser} />
        <FadeAnimation>
          <Container>
            <h2 className="title">Browse rooms</h2>
            <Input type="text" placeholder="Search..." />
            {this.renderRoomList()}
          </Container>
        </FadeAnimation>
      </div>
    )
  }
}

export default withRouter(RoomsPage)

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
  const {page} = params

  const connection = await getConnection()
  const rooms = await connection
    .getRepository<Rooms>('Rooms')
    .createQueryBuilder('room')
    .select(['room.id', 'room.name'])
    .where('room.public = :public', {public: true})
    .orderBy('room.name', 'ASC')
    .limit(25)
    .offset((parseInt(page) - 1) * 25)
    .getMany()
  const roomCount = await connection
    .getRepository<Rooms>('Rooms')
    .createQueryBuilder('room')
    .select(['room.id', 'room.name'])
    .where('room.public = :public', {public: true})
    .getCount()

  return {
    props: {
      rooms: rooms.map((room) => ({
        id: encode(room.id),
        name: room.name
      })),
      pages: Math.ceil(roomCount / 25)
    }
  }
}
