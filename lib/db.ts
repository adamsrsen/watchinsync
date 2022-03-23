import 'reflect-metadata'
import {ConnectionOptions, createConnection} from 'typeorm'
import {db_options} from '../ormconfig'
import Messages from '../entity/Messages'
import Permissions from '../entity/Permissions'
import Roles from '../entity/Roles'
import Rooms from '../entity/Rooms'
import Users from '../entity/Users'
import Videos from '../entity/Videos'

let connection

export default async () => {
  if(!connection) {
    connection = await createConnection({
      ...db_options,
      entities: [
        Messages,
        Permissions,
        Roles,
        Rooms,
        Users,
        Videos
      ]
    } as ConnectionOptions)
  }

  return connection
}