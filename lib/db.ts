import 'ts-node/register'
import 'reflect-metadata'
import {ConnectionOptions, getConnectionManager} from 'typeorm'
import * as db_options from '../ormconfig.json'
import Messages from '../entity/Messages'
import Permissions from '../entity/Permissions'
import Roles from '../entity/Roles'
import Rooms from '../entity/Rooms'
import Users from '../entity/Users'
import Videos from '../entity/Videos'

export default async function getConnection(name: string = 'default') {
  const connectionManager = getConnectionManager()

  if (connectionManager.has(name)) {
    const connection = connectionManager.get(name)

    if (!connection.isConnected) {
      await connection.connect()
    }

    return connection
  }

  return await connectionManager.create({
    name,
    ...db_options,
    entities: [
      Messages,
      Permissions,
      Roles,
      Rooms,
      Users,
      Videos
    ]
  } as ConnectionOptions).connect()
}