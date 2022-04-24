import {NextApiRequest, NextApiResponse} from 'next'
import bodyParser from 'body-parser'
import {promisify} from 'util'
import {v4 as uuidv4} from 'uuid'
import getConnection from '../../../lib/db'
import Rooms from '../../../entity/Rooms'
import {encode} from 'uuid-base64-ts'
import {withIronSessionApiRoute} from 'iron-session/next'
import {sessionOptions} from '../../../lib/session'
import Roles from '../../../entity/Roles'
import {UserRole} from '../../../objects/UserRole'
import Permissions from '../../../entity/Permissions'
import Users from '../../../entity/Users'

async function createRoom(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'POST') {
    await promisify(bodyParser.urlencoded())(req,res)

    if(!req.session?.user) {
      return res.status(401).send('user not logged in')
    }

    if(!req.body?.name){
      return res.status(400).send('name is not specified')
    }

    const connection = await getConnection()
    try {
      let id = uuidv4()
      while(await connection
        .getRepository<Rooms>('Rooms')
        .createQueryBuilder('room')
        .where('room.id = :id', {id})
        .getOne()
      ) {
        id = uuidv4()
      }

      const user = await connection
        .getRepository<Users>('Users')
        .createQueryBuilder('user')
        .where('user.id = :userId', {userId: req.session.user.id})
        .getOne()

      const admin_permissions = new Permissions()
      admin_permissions.play_pause = true
      admin_permissions.seek = true
      admin_permissions.playback_speed = true
      admin_permissions.add_video = true
      admin_permissions.skip_video = true
      admin_permissions.remove_video = true
      admin_permissions.chat = true
      admin_permissions.video_chat = true
      admin_permissions.change_role = true
      await connection
        .getRepository<Permissions>('Permissions')
        .save(admin_permissions)

      const moderator_permissions = new Permissions()
      moderator_permissions.play_pause = true
      moderator_permissions.seek = true
      moderator_permissions.playback_speed = true
      moderator_permissions.add_video = true
      moderator_permissions.skip_video = true
      moderator_permissions.remove_video = true
      moderator_permissions.chat = true
      moderator_permissions.video_chat = true
      moderator_permissions.change_role = false
      await connection
        .getRepository<Permissions>('Permissions')
        .save(moderator_permissions)

      const member_permissions = new Permissions()
      member_permissions.play_pause = false
      member_permissions.seek = false
      member_permissions.playback_speed = false
      member_permissions.add_video = true
      member_permissions.skip_video = false
      member_permissions.remove_video = false
      member_permissions.chat = true
      member_permissions.video_chat = true
      member_permissions.change_role = false
      await connection
        .getRepository<Permissions>('Permissions')
        .save(member_permissions)

      const room = new Rooms()
      room.id = id
      room.name = req.body.name
      room.public = req.body?.public
      room.owner = user
      room.admin_permissions = admin_permissions
      room.moderator_permissions = moderator_permissions
      room.member_permissions = member_permissions
      await connection
        .getRepository<Rooms>('Rooms')
        .save(room)

      const owner = new Roles()
      owner.role = UserRole.OWNER
      owner.user = user
      owner.room = room
      await connection
        .getRepository<Roles>('Roles')
        .save(owner)

      res.send({id: encode(id)})
    }
    catch(e) {
      res.status(400).send('database error')
    }
  }
  else {
    res.status(405).end()
  }
}

export default withIronSessionApiRoute(createRoom, sessionOptions)