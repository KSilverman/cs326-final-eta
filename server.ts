const express = require('express')
const path = require('path');

import { User } from './types/user'
import { Course } from './types/course'

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

    this.app.post('/user/register', this.RequestRegister)
    this.app.post('/user/login', this.RequestLogin)

    // ???
    this.app.post('/user/:uid', this.RequestGetUser)

    // COURSE STUFF
    this.app.post('/user/:uid/course/all', this.RequestGetAllCourses)
    this.app.post('/user/:uid/course/create', this.RequestCreateCourse)
    this.app.post('/user/:uid/course/:id', this.RequestGetCourse)
    this.app.post('/user/:uid/course/:id/delete', this.RequestDeleteCourse)
    this.app.post('/user/:uid/course/:id/update', this.RequestUpdateCourse)

    // ASSIGNMENT STUFF
    this.app.post('/user/:uid/assignment/all', this.RequestGetAllAssignments)
    this.app.post('/user/:uid/assignment/create', this.RequestCreateAssignment)
    this.app.post('/user/:uid/assignment/:id', this.RequestGetAssignment)
    this.app.post('/user/:uid/assignment/:id/delete', this.RequestDeleteAssignment)
    this.app.post('/user/:uid/assignment/:id/update', this.RequestUpdateAssignment)

    // EXTRACURRICULAR STUFF
    this.app.post('/user/:uid/extracurricular/all', this.RequestGetAllExtracurriculars)
    this.app.post('/user/:uid/extracurricular/create', this.RequestCreateExtracurricular)
    this.app.post('/user/:uid/extracurricular/:id', this.RequestGetExtracurricular)
    this.app.post('/user/:uid/extracurricular/:id/delete', this.RequestDeleteExtracurricular)
    this.app.post('/user/:uid/extracurricular/:id/update', this.RequestUpdateExtracurricular)

    // EXAM STUFF
    this.app.post('/user/:uid/exam/all', this.RequestGetAllExams)
    this.app.post('/user/:uid/exam/create', this.RequestCreateExam)
    this.app.post('/user/:uid/exam/:id', this.RequestGetExam)
    this.app.post('/user/:uid/exam/:id/delete', this.RequestDeleteExam)
    this.app.post('/user/:uid/exam/:id/update', this.RequestUpdateExam)

    // CALENDAR
    this.app.post('/user/:uid/calendar', this.RequestGetCalendar)
  }

  // Requests

  private RequestRegister(req, res) {
    var response = {
      'status': 'success'
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  private RequestLogin(req, res) {
    var response = {
      'status': 'failed',
      'message': 'Incorrect username or password'
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  private RequestGetUser(req, res) {
    var response;
    try {
      var uid = parseInt(req.params.uid)
      if (!uid) throw new Error();

      response = this.GetUser(uid)
    } catch(e) {
      response = {
        'status': 'failed',
        'error': 'Unable to get ' + req.params.uid
      }
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  private RequestGetAllCourses(req, res) {
    res.send('data for all courses belonging to ' + req.params.uid)
  }

  private RequestCreateCourse(req, res) {
    var response;
    try {
      var uid : number = parseInt(req.params.uid)
      console.log(uid)

      response = this.CreateCourse(uid, new Course(uid, 0, "A New Course"))
    } catch(e) {
      response = {
        'status': 'failed'
      }
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  private RequestGetCourse(req, res) {
    var response;
    try {
      var uid = parseInt(req.params.uid)
      var id = parseInt(req.params.id)
      if (!uid || !id) throw new Error();

      response = this.GetCourse(uid, id)
    } catch(e) {
      response = {
        'status': 'failed'
      }
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  private RequestDeleteCourse(req, res) {
    var response;
    try {
      var uid : number = parseInt(req.params.uid)
      var id : number = parseInt(req.params.id)
      if (!uid || !id) throw new Error();

      response = this.DeleteCourse(uid, id)
    } catch(e) {
      response = {
        'status': 'failed'
      }
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  private RequestUpdateCourse(req, res) {
    var response;
    try {
      var uid : number = parseInt(req.params.uid)
      var id : number = parseInt(req.params.id)
      if (!uid || !id) throw new Error();

      response = this.UpdateCourse(uid, id, new Course(uid, id, "An Updated Course"))
    } catch(e) {
      response = {
        'status': 'failed'
      }
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  private RequestGetAllAssignments(req, res) {

  }

  private RequestGetAssignment(req, res) {

  }

  private RequestCreateAssignment(req, res) {

  }

  private RequestDeleteAssignment(req, res) {

  }

  private RequestUpdateAssignment(req, res) {

  }

  private RequestGetAllExams(req, res) {

  }

  private RequestGetExam(req, res) {

  }

  private RequestCreateExam(req, res) {

  }

  private RequestDeleteExam(req, res) {

  }

  private RequestUpdateExam(req, res) {

  }

  private RequestGetAllExtracurriculars(req, res) {

  }

  private RequestGetExtracurricular(req, res) {

  }

  private RequestCreateExtracurricular(req, res) {

  }

  private RequestDeleteExtracurricular(req, res) {

  }

  private RequestUpdateExtracurricular(req, res) {

  }

  private RequestGetCalendar(req, res) {
    var response = {
      'status': 'success',
      'calendar': [
        {
          'type': 'course',
          'id': 1,
          'event': {
  					title: 'CS 326 Lecture',
  					daysOfWeek: [2, 4],
  					startTime: '16:00',
  					endTime: '17:15',
  					endRecur: '2020-04-29'
  				}
        },
        {
          'type': 'course',
          'id': 1,
          'event': {
  					title: 'CS 326 Discussion',
  					daysOfWeek: [1],
  					startTime: '16:00',
  					endTime: '17:15',
  					endRecur: '2020-04-29'
  				}
        }
      ]
    };

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  // USER

  private GetUser(uid : number) {
    var user = new User(uid, 'Devon'); // flubbery

    var response = {
      'status': 'success',
      'user': user
    }

    return response;
  }

  // Course

  private GetCourse(uid : number, id : number) {
    var course = new Course(uid, id, "The Best Course Ever"); // flubbery

    var response = {
      'status': 'success',
      'course': course
    }

    return response;
  }

  private CreateCourse(uid : number, course : Course) {
    course = new Course(uid, Math.floor(Math.random() * 100), "A Brand New Course"); // flubbery

    var response = {
      'status': 'success',
      'course': course
    }

    return response;
  }

  private UpdateCourse(uid : number, id : number, course : Course) {
    var response = {
      'status': 'success',
      'course': course
    }

    return response;
  }

  private DeleteCourse(uid : number, id : number) {
    var response = {
      'status': 'success'
    }

    return response;
  }
}
