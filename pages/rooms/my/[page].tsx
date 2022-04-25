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
import {renderLoading} from '../../../lib/util'
import Room from '../../../objects/Room'
import Rooms from '../../../entity/Rooms'
import {withIronSessionSsr} from 'iron-session/next'
import {sessionOptions} from '../../../lib/session'
import getConnection from '../../../lib/db'
import {encode} from 'uuid-base64-ts'
import AnimatePage from '../../../components/AnimatePage'

interface Props {
  user: User
  setUser: Function
  userLoaded: boolean
  rooms: Room[]
  pages: number
}

export default class MyRooms extends Component<Props> {
  render() {
    if(!this.props.userLoaded) {
      return renderLoading()
    }

    return (
      <div>
        <Head>
          <title>Browse rooms - WatchInSync</title>
          <link rel="icon" href="/favicon.ico"/>
        </Head>

        <Header user={this.props.user} setUser={this.props.setUser} />
        <AnimatePage>
          <Container>
            <h2 className="title">My rooms</h2>
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
                    You haven&#39;t joined any rooms yet, <Link href="/rooms/page/1"><a className="link">browse public rooms</a></Link> or <Link href="/room/create"><a className="link">create one</a></Link>
                  </p>
                </Item>
              )}
            </List>
          </Container>
        </AnimatePage>
      </div>
    )
  }
}


export const getServerSideProps = withIronSessionSsr(async ({params, req, res}) => {
  const userId = req.session?.user?.id
  if(!userId) {
    return {
      redirect: {
        destination: '/sign_in',
        permanent: false,
      },
    }
  }

  const connection = await getConnection()
  const rooms = await connection
    .getRepository<Rooms>('Rooms')
    .createQueryBuilder('room')
    .select(['room.id', 'room.name'])
    .innerJoin('room.roles', 'role', 'role.user.id = :userId', {userId})
    .orderBy('role.role', 'ASC')
    .limit(25)
    .offset((parseInt(params.page as string) - 1) * 25)
    .getMany()
  const roomCount = await connection
    .getRepository<Rooms>('Rooms')
    .createQueryBuilder('room')
    .innerJoin('room.roles', 'role', 'role.user.id = :userId', {userId})
    .orderBy('role.role', 'ASC')
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
}, sessionOptions)
