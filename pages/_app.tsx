import '../styles/globals.scss'
import {Toaster} from 'react-hot-toast'
import {useEffect, useState} from 'react'
import axios from 'axios'
import {AnimatePresence} from 'framer-motion'
import NextProgress from 'next-progress'
import Router from 'next/router'

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

const routeChange = () => {
  // Temporary fix to avoid flash of unstyled content
  // during route transitions. Keep an eye on this
  // issue and remove this code when resolved:
  // https://github.com/vercel/next.js/issues/17464

  const tempFix = () => {
    const allStyleElems = document.querySelectorAll('style[media="x"]')
    allStyleElems.forEach((elem) => {
      elem.removeAttribute('media')
    })
  }
  tempFix()
}

Router.events.on('routeChangeComplete', routeChange )
Router.events.on('routeChangeStart', routeChange )

export default MyApp
