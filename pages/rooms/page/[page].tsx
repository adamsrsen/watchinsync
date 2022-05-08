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
import getConnection from '../../../lib/db'
import Rooms from '../../../entity/Rooms'
import Room from '../../../objects/Room'
import {encode} from 'uuid-base64-ts'
import {NextRouter, withRouter} from 'next/router'
import FadeAnimation from '../../../components/FadeAnimation'
import Paginator from '../../../components/Paginator'

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
    const page = parseInt(this.props.router.query.page as string)

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
            {this.renderRoomList()}
            <Paginator page={page} totalPages={this.props.pages} baseUrl="/rooms/page" />
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
  const ROOMS_PER_PAGE = 10
  const {page} = params
  if(parseInt(page as string) < 1) {
    return {
      notFound: true
    }
  }

  const connection = await getConnection()
  const rooms = await connection
    .getRepository<Rooms>('Rooms')
    .createQueryBuilder('room')
    .select(['room.id', 'room.name'])
    .where('room.public = :public', {public: true})
    .orderBy('room.name', 'ASC')
    .limit(ROOMS_PER_PAGE)
    .offset((parseInt(page as string) - 1) * ROOMS_PER_PAGE)
    .getMany()
  const pageCount = Math.ceil((await connection
    .getRepository<Rooms>('Rooms')
    .createQueryBuilder('room')
    .select(['room.id', 'room.name'])
    .where('room.public = :public', {public: true})
    .getCount()) / ROOMS_PER_PAGE)

  if(parseInt(page as string) > pageCount && (pageCount > 0 || parseInt(page as string) > 1)) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      rooms: rooms.map((room) => ({
        id: encode(room.id),
        name: room.name
      })),
      pages: pageCount
    }
  }
}
