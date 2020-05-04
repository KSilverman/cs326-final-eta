const express = require('express')
const path = require('path');
const session = require('express-session')
const uuid = require('uuid')

import { User } from './types/user'
import { Course } from './types/course'
import { Database } from './database'

export class Server {
  private app : any;
  private port : number;
  private database : Database;

  constructor(db : Database, port: any) {
    this.database = db
    this.port = port;

    this.app = express();
    this.CreateRouting();

    this.app.listen(this.port, () => {
      console.log('Express started on port ' + this.port)
    })
  }

  private CreateRouting() {

    this.app.use(session({
      genid: function(req : any) {
        return uuid.v4()
      },
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true
    }))

    // express stuff
    this.app.get('/', (req : any, res : any) => {
      res.sendFile(path.join(__dirname + '/static/index.html'));
    })

    this.app.get('/dashboard', (req : any, res : any) => {
      res.sendFile(path.join(__dirname + '/static/dashboard.html'));
    })

    this.app.get('/calendar', (req : any, res : any) => {
      res.sendFile(path.join(__dirname + '/static/calendar.html'));
    })

    this.app.use('/lib', express.static('static/lib'));
    this.app.use('/css', express.static('static/css'));
    this.app.use('/img', express.static('static/img'));
    this.app.use('/script', express.static('static/script'));

    // API stuff

    this.app.use(express.json())

    this.app.post('/user/register', this.RequestRegister.bind(this))
    this.app.post('/user/login', this.RequestLogin.bind(this))

    // ???
    this.app.post('/user/:uid', this.RequestGetUser.bind(this))

    // COURSE STUFF
    this.app.post('/api/course/all', this.RequestGetAllCourses.bind(this))
    this.app.post('/api/course/create', this.RequestCreateCourse.bind(this))
    this.app.post('/api/course/:id', this.RequestGetCourse.bind(this))
    this.app.post('/api/course/:id/delete', this.RequestDeleteCourse.bind(this))
    this.app.post('/api/course/:id/update', this.RequestUpdateCourse.bind(this))

    // ASSIGNMENT STUFF
    this.app.post('/api/assignment/all', this.RequestGetAllAssignments.bind(this))
    this.app.post('/api/assignment/create', this.RequestCreateAssignment.bind(this))
    this.app.post('/api/assignment/:id', this.RequestGetAssignment.bind(this))
    this.app.post('/api/assignment/:id/delete', this.RequestDeleteAssignment.bind(this))
    this.app.post('/api/assignment/:id/update', this.RequestUpdateAssignment.bind(this))

    // EXTRACURRICULAR STUFF
    this.app.post('/api/extracurricular/all', this.RequestGetAllExtracurriculars.bind(this))
    this.app.post('/api/extracurricular/create', this.RequestCreateExtracurricular.bind(this))
    this.app.post('/api/extracurricular/:id', this.RequestGetExtracurricular.bind(this))
    this.app.post('/api/extracurricular/:id/delete', this.RequestDeleteExtracurricular.bind(this))
    this.app.post('/api/extracurricular/:id/update', this.RequestUpdateExtracurricular.bind(this))

    // EXAM STUFF
    this.app.post('/api/exam/all', this.RequestGetAllExams.bind(this))
    this.app.post('/api/exam/create', this.RequestCreateExam.bind(this))
    this.app.post('/api/exam/:id', this.RequestGetExam.bind(this))
    this.app.post('/api/exam/:id/delete', this.RequestDeleteExam.bind(this))
    this.app.post('/api/exam/:id/update', this.RequestUpdateExam.bind(this))

    // CALENDAR
    this.app.post('/api/calendar', this.RequestGetCalendar.bind(this))
  }

  private checkAuthorization(id1 : number, id2 : number) : boolean {
    return (id1 == id2)
  }

  private validateSessionAndGetUID(req : any) : number | null {
    console.log(req.session)
    if (req.session.uid) {
      return req.session.uid
    } else {
      return null;
    }
  }

  // Requests

  private async RequestRegister(req : any, res : any) {
    var response : any = {
      'status': 'success',
      user: null
    }

    try {
      // todo validation

      let name = req.body.name;
      let hash = await User.createHash(req.body.password)

      let existingUser = await this.database.getUserByName(name);

      if (existingUser != null) {
        // username taken
        response = {
          status: 'failed',
          message: 'Username is already in use'
        };
      } else {
        let user : User = await this.database.createUser(name, hash)

        response = {
          status: 'success',
          user: await user.objectify()
        };
      }
    } catch (e) {
      console.log(e)
      response = {
        status: 'error'
      };
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  private async RequestLogin(req : any, res : any) {
    var response : any = {
      status: 'failed',
      message: 'Incorrect username or password'
    }

    let name = req.body.name;
    let hash = await User.createHash(req.body.password)

    let user = await this.database.getUserByName(name)

    console.log(user)

    if (user != null) {
      if (await user.checkHash(req.body.password)) {
        // auth success
        response.status = 'success';
        response.user = await user.objectify();
        response.message = '';

        req.session.uid = user.id;
      }
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  private async RequestGetUser(req : any, res : any) {
    var response;
    try {
      var uid = parseInt(req.params.uid)

      if (!uid || this.checkAuthorization(uid, req.session.uid)) throw new Error();

      let user : User = await this.database.getUser(uid)

      response = {
        'status': 'success',
        'user': await user.objectify()
      }
    } catch(e) {
      console.log(e)
      response = {
        'status': 'failed',
        'error': 'Unable to get ' + req.params.uid
      }
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  private RequestGetAllCourses(req : any, res : any) {
    var _uid = this.validateSessionAndGetUID(req)
    if (_uid == null) {
      res.end(JSON.stringify({status: 'unauthorized'}));
      return;
    }
    var uid : number = _uid;

    var response = {
      status: 'success',
      courses: [
        {
          title: 'CS 326',
          id: 1
        },
        {
          title: 'CS 373',
          id: 2
        },
        {
          title: 'CS 589',
          id: 3
        }
      ]
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  private RequestCreateCourse(req : any, res : any) {
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

  private RequestGetCourse(req : any, res : any) {
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

  private RequestDeleteCourse(req : any, res : any) {
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

  private RequestUpdateCourse(req : any, res : any) {
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

  private RequestGetAllAssignments(req : any, res : any) {
    var response = {
      status: 'success',
      categories: [
        {
          title: 'Today',
          assignments: [
            {
              title: 'Milestone 2',
              course: {
                title: 'CS 326',
                id: 7
              },
              dueDate: '4/24/2020',
              expectedTTC: '4 hours',
              notes: 'Important to start early!'
            }
          ]
        },
        {
          title: 'Tomorrow',
          assignments: [
            {
              title: 'Milestone 3',
              course: {
                title: 'CS 326',
                id: 7
              },
              dueDate: '4/25/2020',
              expectedTTC: '4 hours',
              notes: 'Important to start earlier!'
            },
            {
              title: 'Milestone 4',
              course: {
                title: 'CS 326',
                id: 7
              },
              dueDate: '4/30/2020',
              expectedTTC: '40 hours',
              notes: 'Important to start earlier!'
            }
          ]
        }
      ]
    };
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  private RequestGetAssignment(req : any, res : any) {

  }

  private RequestCreateAssignment(req : any, res : any) {

  }

  private RequestDeleteAssignment(req : any, res : any) {

  }

  private RequestUpdateAssignment(req : any, res : any) {

  }

  private RequestGetAllExams(req : any, res : any) {

  }

  private RequestGetExam(req : any, res : any) {

  }

  private RequestCreateExam(req : any, res : any) {

  }

  private RequestDeleteExam(req : any, res : any) {

  }

  private RequestUpdateExam(req : any, res : any) {

  }

  private RequestGetAllExtracurriculars(req : any, res : any) {

  }

  private RequestGetExtracurricular(req : any, res : any) {

  }

  private RequestCreateExtracurricular(req : any, res : any) {

  }

  private RequestDeleteExtracurricular(req : any, res : any) {

  }

  private RequestUpdateExtracurricular(req : any, res : any) {

  }

  private RequestGetCalendar(req : any, res : any) {
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
