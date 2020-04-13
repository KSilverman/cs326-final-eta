const express = require('express')

export class Server {
  private app;
  private port;
  private database;

  constructor(db, port: number) {
    this.database = db
    this.port = port;

    this.app = express();
    this.CreateRouting();

    this.app.listen(this.port, () => {
      console.log('Express started on port ' + this.port)
    })
  }

  private CreateRouting() {
    // express stuff

    this.app.get('/', (req, res) => {
      res.send("Hello world!");
    })
  }
}
