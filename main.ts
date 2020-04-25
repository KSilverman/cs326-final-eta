import { Database } from './database'
import { Server } from './server'

const database = new Database()


database.connect("mongodb://localhost:27017/mydb").then(() => {

  const server = new Server(database, process.env.PORT);

}).catch((e) => {

  console.log('Failed to connect to MongoDB!');
  console.error(`\n${e.message}\n`);

})
