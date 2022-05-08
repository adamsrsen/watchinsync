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
import FadeAnimation from '../../../components/FadeAnimation'
import Paginator from '../../../components/Paginator'
import {Router, withRouter} from 'next/router'

interface Props {
  user: User
  setUser: Function
  userLoaded: boolean
  rooms: Room[]
  pages: number
  router: Router
}

class MyRooms extends Component<Props> {
  render() {
    if(!this.props.userLoaded) {
      return renderLoading()
    }
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
            <Paginator page={page} totalPages={this.props.pages} baseUrl="/rooms/my" />
          </Container>
        </FadeAnimation>
      </div>
    )
  }
}

export default withRouter(MyRooms)


export const getServerSideProps = withIronSessionSsr(async ({params, req, res}) => {
  const ROOMS_PER_PAGE = 10
  const userId = req.session?.user?.id
  if(!userId) {
    return {
      redirect: {
        destination: '/sign_in',
        permanent: false,
      },
    }
  }
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
    .innerJoin('room.roles', 'role', 'role.user.id = :userId', {userId})
    .orderBy('role.role', 'ASC')
    .orderBy('room.name', 'ASC')
    .limit(ROOMS_PER_PAGE)
    .offset((parseInt(page as string) - 1) * ROOMS_PER_PAGE)
    .getMany()
  const pageCount = Math.ceil((await connection
    .getRepository<Rooms>('Rooms')
    .createQueryBuilder('room')
    .innerJoin('room.roles', 'role', 'role.user.id = :userId', {userId})
    .orderBy('role.role', 'ASC')
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
}, sessionOptions)
