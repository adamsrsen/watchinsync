import {decode, encode} from 'uuid-base64-ts'
import Head from 'next/head'
import Header from '../components/Header'
import CenteredContent from '../components/CenteredContent'

export const decodeRoomId = (id) => {
  const roomId = decode(id)
  if(id !== encode(roomId)){
    throw Error()
  }

  return roomId
}

export const preventDefault = (fn) => (event) => {
  fn(event)
  event.preventDefault()
}

export const renderLoading = () => {
  return (
    <div>
      <Head>
        <title>Create room - WatchInSync</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <CenteredContent>
        <h2>Loading...</h2>
      </CenteredContent>
    </div>
  )
}