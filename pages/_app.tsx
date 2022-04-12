import '../styles/globals.scss'
import {Toaster} from 'react-hot-toast'
import {useEffect, useState} from 'react'
import axios from 'axios'

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState()
  const [update, setUpdate] = useState(false)

  useEffect(() => {
    axios.get('/api/user').then(({data}) => {
      setUser(data.user)
    })
  }, [update])

  return (
    <>
      <Component {...pageProps} user={user} updateUser={() => setUpdate(!update)} />
      <Toaster
        reverseOrder
        toastOptions={{
          style: {
            backgroundColor: '#151208',
            color: '#d5d5d5'
          }
        }}
      />
    </>
  )
}

export default MyApp
