import 'ts-node/register'

export const db_options = {
   'type': 'postgres',
   'host': 'localhost',
   'port': 5432,
   'username': 'watcher',
   'password': 'test',
   'database': 'watch_in_sync',
   'synchronize': true,
   'logging': false,
   'entities': [
      'entity/**/*.ts'
   ],
   'migrations': [
      'migration/**/*.ts'
   ],
   'subscribers': [
      'subscriber/**/*.ts'
   ],
   'cli': {
      'entitiesDir': 'entity',
      'migrationsDir': 'migration',
      'subscribersDir': 'subscriber'
   }
}