const express = require('express')
const path = require('path');

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
    this.app.post('/user/login', this.RequestLogin)

    // ???
    this.app.post('/user/:uid', this.RequestGetUser.bind(this))

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

  private async RequestRegister(req : any, res : any) {
    var response : any = {
      'status': 'success',
      user: null
    }
    
    try {
      let name = req.body.name;
      let password = req.body.password;
      let hash = await User.createHash(password)

      // TODO validation, get new user id

      let user : User = new User(7, name, hash);
      this.database.putUser(user)

      response.user = user;
    } catch (e) {
      console.log(e)
      response.status = 'except';
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  private RequestLogin(req : any, res : any) {
    var response = {
      'status': 'failed',
      'message': 'Incorrect username or password'
    }

    let name = req.body.name;
    let password = req.body.password;

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  private async RequestGetUser(req : any, res : any) {
    var response;
    try {
      var uid = parseInt(req.params.uid)
      if (!uid) throw new Error();
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
