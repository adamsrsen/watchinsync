import '../styles/globals.scss'
import {Toaster} from 'react-hot-toast'
import {useEffect, useState} from 'react'
import axios from 'axios'

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState()
  const [userLoaded, setLoaded] = useState(false)

  useEffect(() => {
    axios.get('/api/user').then(({data}) => {
      setUser(data.user)
      setLoaded(true)
    })
  }, [])

  return (
    <>
      <Component {...pageProps} user={user} setUser={setUser} userLoaded={userLoaded} />
      <Toaster
        reverseOrder
        toastOptions={{
          style: {
            backgroundColor: '#151208',
            color: '#d5d5d5',
            fontSize: '1.2rem'
          }
        }}
      />
    </>
  )
}

export default MyApp
