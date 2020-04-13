const express = require('express')
const path = require('path');

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
      res.sendFile(path.join(__dirname + '/static/index.html'));
    })

    this.app.get('/dashboard', (req, res) => {
      res.sendFile(path.join(__dirname + '/static/dashboard.html'));
    })

    this.app.get('/calendar', (req, res) => {
      res.sendFile(path.join(__dirname + '/static/calendar.html'));
    })

    this.app.use('/lib', express.static('static/lib'));
    this.app.use('/css', express.static('static/css'));
    this.app.use('/img', express.static('static/img'));

    // API stuff

    this.app.post('/user/register', (req, res) => {
      var response = {
        'status': 'success'
      }

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(response))
    })

    this.app.post('/user/login', (req, res) => {
      var response = {
        'status': 'failed',
        'message': 'Incorrect username or password'
      }

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(response))
    })

    // ???
    this.app.get('/user/:uid', (req, res) => {
      res.send('data for user with uid ' + req.params.uid)
    })

    // COURSE STUFF

    this.app.get('/user/:uid/course/:id', (req, res) => {
      res.send('data for course with id ' + req.params.id)
    })

    this.app.get('/user/:uid/course/all', (req, res) => {
      res.send('data for all courses belonging to ' + req.params.uid)
    })

    this.app.get('/user/:uid/course/create', (req, res) => {
      res.send('create a course belonging to ' + req.params.uid)
    })

    this.app.get('/user/:uid/course/:id/delete', (req, res) => {
      res.send('delete course ' + req.params.id + ' belonging to ' + req.params.uid)
    })

    this.app.get('/user/:uid/course/:id/update', (req, res) => {
      res.send('update course ' + req.params.id + ' belonging to ' + req.params.uid)
    })

    // ASSIGNMENT STUFF

    this.app.get('/user/:uid/assignment/:id', (req, res) => {
      res.send('data for assignment with id ' + req.params.id)
    })

    this.app.get('/user/:uid/assignment/all', (req, res) => {
      res.send('data for all assignments belonging to ' + req.params.uid)
    })

    this.app.get('/user/:uid/assignment/create', (req, res) => {
      res.send('create a assignment belonging to ' + req.params.uid)
    })

    this.app.get('/user/:uid/assignment/:id/delete', (req, res) => {
      res.send('delete assignment ' + req.params.id + ' belonging to ' + req.params.uid)
    })

    this.app.get('/user/:uid/assignment/:id/update', (req, res) => {
      res.send('update assignment ' + req.params.id + ' belonging to ' + req.params.uid)
    })
  }
}
