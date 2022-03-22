import 'reflect-metadata'
import {ConnectionOptions, createConnection} from 'typeorm'
import * as db_options from '../ormconfig.json'

Promise.resolve(createConnection(db_options as ConnectionOptions))