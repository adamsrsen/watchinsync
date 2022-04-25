import '../styles/globals.scss'
import {Toaster} from 'react-hot-toast'
import {useEffect, useState} from 'react'
import axios from 'axios'
import {AnimatePresence} from 'framer-motion'
import NextProgress from 'next-progress'

function MyApp({ Component, pageProps, router }) {
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
      <NextProgress color="#3ba55c" options={{ showSpinner: false }} />
      <AnimatePresence exitBeforeEnter initial={false}>
        <Component {...pageProps} user={user} setUser={setUser} userLoaded={userLoaded} key={router.route} />
      </AnimatePresence>
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
