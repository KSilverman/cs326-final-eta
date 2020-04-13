import { Database } from './database'
import { Server } from './server'

const database = new Database()
const server = new Server(database, 80)
