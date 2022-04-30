import {NextApiRequest} from 'next'
import bodyParser from 'body-parser'
import {promisify} from 'util'
import getConnection from '../../../../lib/db'
import Videos, {VideoType} from '../../../../entity/Videos'
import {decodeRoomId} from '../../../../lib/util'
import {NextApiResponseSocketIO} from '../../../../objects/NextApiResponseSocketIO'
import axios from 'axios'
import {withIronSessionApiRoute} from 'iron-session/next'
import {sessionOptions} from '../../../../lib/session'
import {verifyPermission} from '../../../../lib/session'

const getType = async (link) => {
  let match = link.match(/^((?:https?:)?\/\/)?((?:www|m)\.)?(?:youtube(-nocookie)?\.com|youtu.be)(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/)
  if(match) {
    const name = (await axios.get(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${match[5]}`)}`)).data?.title
    return [VideoType.YOUTUBE, match[5], name]
  }

  match = link.match(/^((?:https?:)?\/\/)?(www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)$/)
  if(match) {
    const name = (await axios.get(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(link)}`)).data?.title
    return [VideoType.VIMEO, match[4], name]
  }

  match = link.match(/^((?:https?:)?\/\/)?((?:www|m)\.)?(twitch\.tv)\/videos\/([\w\-]+)$/)
  if(match) {
    return [VideoType.TWITCH, match[4], match[4]]
  }

  match = link.match(/^((?:https?:)?\/\/)?((?:www|m)\.)?facebook\.com\/(?:(?:(?:.+\/)?videos\/(?:.+\/)?|watch\/\?v=)(\d+))\/?$/)
  if(match) {
    return [VideoType.FACEBOOK, match[3], match[3]]
  }

  match = link.match(/^((?:https?:)?\/\/)(([-a-zA-Z0-9@:%_\+~#=]{1,63}\.)+[a-z]{2,6})\b(\/[-a-zA-Z0-9@:%_\+.~#?&=]+)*\/([-a-zA-Z0-9@:%_\+.~#?&=]+(\.mp4|\.webm))$/)
  if(match) {
    return [VideoType.DIRECT, link, match[5]]
  }

  return []
}

const addToPlaylist = async function handler(req: NextApiRequest, res: NextApiResponseSocketIO) {
  if(req.method === 'POST') {
    await promisify(bodyParser.urlencoded())(req,res)

    let roomId
    try {
      roomId = decodeRoomId(req.body?.roomId.toString())
    }
    catch(e) {
      return res.status(400).send('roomId has invalid format')
    }

    const [type, link, name] = await getType(req.body?.link)
    if(!type) {
      return res.status(400).send('link has invalid format')
    }

    const connection = await getConnection()
    try {
      if(!await verifyPermission(roomId, req.session?.user?.id, 'add_video')) {
        res.status(401).end()
        return
      }

      await connection
        .createQueryBuilder()
        .insert()
        .into<Videos>('Videos')
        .values({
          type,
          link,
          name,
          position: 1,
          played: false,
          room: {
            id: roomId
          }
        })
        .execute()

      res.socket?.server?.io.in(roomId).emit('update_playlist')

      res.end()
    }
    catch(e) {
      res.status(400).send('database error')
    }
  }
  else {
    res.status(405).end()
  }
}

export default withIronSessionApiRoute(addToPlaylist, sessionOptions)