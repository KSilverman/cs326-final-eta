const express = require('express')
const path = require('path');
const session = require('express-session')
const uuid = require('uuid')

import { User } from './types/user'

import { Course } from './types/course'
import { Exam } from './types/exam'
import { Assignment } from './types/assignment'
import { Extracurricular } from './types/extracurricular'

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
    if (req.session.uid !== null) {
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
          user: user.objectify()
        };
      }
    } catch (e) {
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

    if (user != null) {
      if (await user.checkHash(req.body.password)) {
        // auth success
        response.status = 'success';
        response.user = user.objectify();
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
        'user': user.objectify()
      }
    } catch(e) {
      response = {
        'status': 'failed',
        'error': 'Unable to get ' + req.params.uid
      }
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  private async RequestGetAllCourses(req : any, res : any) {
    var _uid = this.validateSessionAndGetUID(req);
    if (_uid == null) {
      res.end(JSON.stringify({status: 'unauthorized'}));
      return;
    }
    var uid : number = _uid;

    let response;

    try {
      let courses : Course[] = await this.database.getCoursesForUser(uid)

      response = {
        status: 'success',
        courses: courses.map((x) => x.objectify())
      }

    } catch (e) {
      response = {
        status: 'error',
        message: e.message
      }
    }


    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  private async RequestCreateCourse(req : any, res : any) {
    var _uid = this.validateSessionAndGetUID(req);
    if (_uid == null) {
      res.end(JSON.stringify({status: 'unauthorized'}));
      return;
    }
    var uid : number = _uid;

    var response : object = {};

    try {

      let name = req.body.name;
      let calendarData = req.body.calendarData;
      let discussionCalendarData = req.body.discussionCalendarData;

      if (name) {
        let course : Course = await this.database.createCourse(uid, name, calendarData, discussionCalendarData)

        response = {
          status: 'success',
          course: course.objectify()
        }

      } else {
        response = {
          status: 'error',
          message: 'Invalid name'
        }
      }

    } catch (e) {
      response = {
        status: 'error',
        message: e.message
      }
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  private async RequestGetCourse(req : any, res : any) {
    var response : object = {};


    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  private async RequestDeleteCourse(req : any, res : any) {

      var _uid = this.validateSessionAndGetUID(req);
      if (_uid == null) {
        res.end(JSON.stringify({status: 'unauthorized'}));
        return;
      }
      var uid : number = _uid;

      let response;

      try {
        var id : number = parseInt(req.params.id)

        let course = await this.database.getCourse(id);

        if (course == null || !this.checkAuthorization(uid, course.uid)) {
          response = {
            status: 'unauthorized'
          };
        } else {
          await this.database.deleteCourse(id)
          response = {
            status: 'success'
          }
        }


      } catch (e) {
        response = {
          status: 'failed',
          message: e.message
        }
      }

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(response))
  }

  private async RequestUpdateCourse(req : any, res : any) {
    var _uid = this.validateSessionAndGetUID(req);
    if (_uid == null) {
      res.end(JSON.stringify({status: 'unauthorized'}));
      return;
    }
    var uid : number = _uid;

    let response;
    try {
      let id = req.params.id;

      let course : Course = await this.database.getCourse(id);

      if (course == null || !this.checkAuthorization(uid, course.uid)) {
        response = {
          status: 'unauthorized'
        };
      } else {

        if (req.body.title) course.title = req.body.title;

        if (req.body.calendarData !== undefined) course.calendarData = req.body.calendarData;
        if (req.body.discussionCalendarData !== undefined) course.discussionCalendarData = req.body.discussionCalendarData;


        await this.database.putCourse(course)
        response = {
          status: 'success',
          assignment: course.objectify()
        }
      }

    } catch(e) {

    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  private async RequestGetAllAssignments(req : any, res : any) {
    var _uid = this.validateSessionAndGetUID(req);
    if (_uid == null) {
      res.end(JSON.stringify({status: 'unauthorized'}));
      return;
    }
    var uid : number = _uid;

    let assignments = await this.database.getAssignmentsForUser(uid);

    assignments.sort((a, b) => {
      return a.due - b.due
    })

    let now = Date.now()
    let today = new Date()

    let todayEnd = new Date()
    todayEnd.setHours(24)
    todayEnd.setMinutes(0)
    todayEnd.setSeconds(0)
    todayEnd.setMilliseconds(0)

    let todayEndTime = todayEnd.getTime()

    let tomorrowEnd = new Date(today)
    tomorrowEnd.setHours(24)
    tomorrowEnd.setMinutes(0)
    tomorrowEnd.setSeconds(0)
    tomorrowEnd.setMilliseconds(0)
    tomorrowEnd.setDate(tomorrowEnd.getDate() + 1)

    let tomorrowEndTime = tomorrowEnd.getTime()

    let thisWeekEnd = new Date(today);
    thisWeekEnd.setDate(today.getDate() + 7);
    thisWeekEnd.setHours(0)
    thisWeekEnd.setSeconds(0)

    let thisWeekEndTime = thisWeekEnd.getTime()

    // TODO sort, categories

    let categoryData : any = [
      {
        title: 'Late',
        threshold: 0
      },
      {
        title: 'Today',
        threshold: now
      },
      {
        title: 'Tomorrow',
        threshold: todayEndTime
      },
      {
        title: 'This Week',
        threshold: tomorrowEndTime
      },
      {
        title: 'Happily Ever After',
        threshold: thisWeekEndTime
      }
    ];
    let currentCategory = 0;

    let categories = [];
    let category: any = {title: categoryData[currentCategory].title, assignments: []}

    for (let assignment of assignments) {
      let due = assignment.due;

      while (currentCategory + 1 < categoryData.length && due >= categoryData[currentCategory + 1].threshold) {
        if (category.assignments.length > 0) {
          categories.push(category)
        }

        currentCategory++;
        category = {title: categoryData[currentCategory].title, assignments: []}
      }

      category.assignments.push(assignment.objectify());

    }

    categories.push(category)


    var response : object = {
      status: 'success',
      categories: categories
    };
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  private async RequestGetAssignment(req : any, res : any) {

  }

  private async RequestCreateAssignment(req : any, res : any) {
    var _uid = this.validateSessionAndGetUID(req);
    if (_uid == null) {
      res.end(JSON.stringify({status: 'unauthorized'}));
      return;
    }
    var uid : number = _uid;

    let response;

    try {
      var name = req.body.name;
      var courseId = req.body.courseId;
      var due = req.body.due;
      var note = req.body.note;
      var ttc = Math.min(parseInt(req.body.ttc), 24 * 365);

      let assignment = await this.database.createAssignment(uid, name, courseId, due, note, ttc);

      response = {
        status: 'success',
        assignment: assignment.objectify()
      }
    } catch (e) {
      response = {
        status: 'failed',
        message: e.message
      }
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  private async RequestDeleteAssignment(req : any, res : any) {
    var _uid = this.validateSessionAndGetUID(req);
    if (_uid == null) {
      res.end(JSON.stringify({status: 'unauthorized'}));
      return;
    }
    var uid : number = _uid;

    let response;

    try {
      var id : number = parseInt(req.params.id)

      let assignment = await this.database.getAssignment(id);

      if (assignment == null || !this.checkAuthorization(uid, assignment.uid)) {
        response = {
          status: 'unauthorized'
        };
      } else {
        await this.database.deleteAssignment(id)
        response = {
          status: 'success'
        }
      }


    } catch (e) {
      response = {
        status: 'failed',
        message: e.message
      }
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  private async RequestUpdateAssignment(req : any, res : any) {
    var _uid = this.validateSessionAndGetUID(req);
    if (_uid == null) {
      res.end(JSON.stringify({status: 'unauthorized'}));
      return;
    }
    var uid : number = _uid;

    let response;
    try {
      let id  : number = parseInt(req.params.id);

      let assignment = await this.database.getAssignment(id);

      if (assignment == null || !this.checkAuthorization(uid, assignment.uid)) {
        response = {
          status: 'unauthorized'
        };
      } else {

        if (req.body.courseId) assignment.courseId = req.body.courseId;

        if (req.body.name !== undefined) assignment.name = req.body.name;
        if (req.body.note !== undefined) assignment.note = req.body.note;

        if (req.body.due !== undefined) assignment.due = req.body.due;
        if (req.body.ttc !== undefined) assignment.ttc = Math.min(parseInt(req.body.ttc), 24 * 365);

        if (req.body.completed !== undefined) assignment.completed = req.body.completed;


        await this.database.putAssignment(assignment)
        response = {
          status: 'success',
          assignment: assignment.objectify()
        }
      }

    } catch(e) {
      response = {
        status: 'error',
        message: e.message
      }
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  private async RequestGetAllExams(req : any, res : any) {
    var _uid = this.validateSessionAndGetUID(req);
    if (_uid == null) {
      res.end(JSON.stringify({status: 'unauthorized'}));
      return;
    }
    var uid : number = _uid;

    let response;

    try {
      let exams : Exam[] = await this.database.getExamsForUser(uid)

      response = {
        status: 'success',
        courses: exams.map((x) => x.objectify())
      }

    } catch (e) {
      response = {
        status: 'error',
        message: e.message
      }
    }


    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  private async RequestGetExam(req : any, res : any) {
    var response : object;

    try {
      let id = req.body.id;
      let uid = req.session.uid;

      let exam : Exam = await this.database.getExam(id)

      if (!this.checkAuthorization(exam.uid, uid)) {
        response = {
          status: 'unauthorized'
        };
      } else {
        response = {
          status: 'success',
          exam: exam.objectify()
        };
      }
    } catch (e) {
      response = {
        status: 'error',
        error: e.message
      }
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  private async RequestCreateExam(req : any, res : any) {

  }

  private async RequestDeleteExam(req : any, res : any) {

  }

  private async RequestUpdateExam(req : any, res : any) {

  }

  private async RequestGetAllExtracurriculars(req : any, res : any) {
    var _uid = this.validateSessionAndGetUID(req);
    if (_uid == null) {
      res.end(JSON.stringify({status: 'unauthorized'}));
      return;
    }
    var uid : number = _uid;

    let response;

    try {
      let ecs : Extracurricular[] = await this.database.getECForUser(uid)

      response = {
        status: 'success',
        courses: ecs.map((x) => x.objectify())
      }

    } catch (e) {
      response = {
        status: 'error',
        message: e.message
      }
    }


    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  private async RequestGetExtracurricular(req : any, res : any) {
    var response : object;

    try {
      let id = req.body.id;
      let uid = req.session.uid;

      let ec : Extracurricular = await this.database.getEC(id)

      if (!this.checkAuthorization(ec.uid, uid)) {
        response = {
          status: 'unauthorized'
        };
      } else {
        response = {
          status: 'success',
          extracurricular: ec.objectify()
        };
      }
    } catch (e) {
      response = {
        status: 'error',
        error: e.message
      }
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  private async RequestCreateExtracurricular(req : any, res : any) {
    var _uid = this.validateSessionAndGetUID(req);
    if (_uid == null) {
      res.end(JSON.stringify({status: 'unauthorized'}));
      return;
    }
    var uid : number = _uid;

    let response;

    try {
      var name = req.body.name;
      var calendarData = req.body.calendarData;

      let ec : Extracurricular = await this.database.createEC(uid, name, calendarData);

      response = {
        status: 'success',
        extracurricular: ec.objectify()
      }
    } catch (e) {
      response = {
        status: 'failed',
        message: e.message
      }
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  private async RequestDeleteExtracurricular(req : any, res : any) {
    var _uid = this.validateSessionAndGetUID(req);
    if (_uid == null) {
      res.end(JSON.stringify({status: 'unauthorized'}));
      return;
    }
    var uid : number = _uid;

    let response;

    try {
      var id : number = parseInt(req.params.id)

      let ec : Extracurricular = await this.database.getEC(id);

      if (ec == null || !this.checkAuthorization(uid, ec.uid)) {
        response = {
          status: 'unauthorized'
        };
      } else {
        await this.database.deleteEC(id)
        response = {
          status: 'success'
        }
      }


    } catch (e) {
      response = {
        status: 'failed',
        message: e.message
      }
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  private async RequestUpdateExtracurricular(req : any, res : any) {
    var _uid = this.validateSessionAndGetUID(req);
    if (_uid == null) {
      res.end(JSON.stringify({status: 'unauthorized'}));
      return;
    }
    var uid : number = _uid;

    let response;
    try {
      let id  : number = parseInt(req.params.id);

      let ec : Extracurricular = await this.database.getEC(id);

      if (ec == null || !this.checkAuthorization(uid, ec.uid)) {
        response = {
          status: 'unauthorized'
        };
      } else {

        if (req.body.name !== undefined) ec.name = req.body.name;
        if (req.body.calendarData !== undefined) ec.calendarData = req.body.calendarData;


        await this.database.putEC(ec)
        response = {
          status: 'success',
          extracurricular: ec.objectify()
        }
      }

    } catch(e) {
      response = {
        status: 'error',
        message: e.message
      }
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  private async RequestGetCalendar(req : any, res : any) {

    let uid = req.session.uid;

    // items to be rendered by FullCalendar
    let calendarEvents = [];

    let exams            = await this.database.getExamsForUser(uid);
    // let extracurriculars = await this.database.getExtracurricularsForUser(uid);
    let assignments      = await this.database.getAssignmentsForUser(uid);
    let courses          = await this.database.getCoursesForUser(uid);

    // colors by course mod 5
    let colors = ['#fd588d', '#fd8a5e', '#f6eb52', '#46ddf2', '#10ccbc']


    // times where assignment work cannot be scheduled by the assignment scheduling algo
    let timeBlocks = [];

    for (let course of courses) {
      let event : any = Object.assign({}, course.calendarData)
      event.title = course.title;
      event.color = colors[course.id % 5];

      calendarEvents.push({
        type: 'course',
        id: course.id,
        event: event
      })

      timeBlocks.push({
        start: event.startTime,
        end: event.endTime,
        daysOfWeek: event.daysOfWeek
      })

      if (course.discussionCalendarData) {
        let dEvent : any = Object.assign({}, course.discussionCalendarData)
        dEvent.title = course.title + ' Discussion';
        dEvent.color = colors[course.id % 5];

        calendarEvents.push({
          type: 'course',
          id: course.id,
          event: dEvent
        })

        timeBlocks.push({
          start: dEvent.startTime,
          end: dEvent.endTime,
          daysOfWeek: dEvent.daysOfWeek
        })
      }
    }

    for (let exam of exams) {
      let calendarEntry = {
        type: 'exam',
        id: exam.id,
        event: exam.calendarData
      }

      calendarEvents.push(calendarEntry)
    }



    let assignmentTimePairs = this.getAssignmentStartTimes(assignments, timeBlocks);
    for (let pair of assignmentTimePairs) {
      let splits = pair.splits;
      let assignment = pair.assignment;

      let course : Course = await this.database.getCourse(assignment.courseId);

      let i = 0;
      for (let split of splits) {
        let calendarEntry = {
          type: 'assignment',
          id: assignment.id,
          event: {
            title: `[${course.title}] ${assignment.name} (${splits.length - i++} / ${splits.length})`,
            start: split.startTime,
            end: split.startTime + split.duration,
            backgroundColor: colors[assignment.courseId % 5] + '77',
            borderColor: colors[assignment.courseId % 5]
          }
        }
        calendarEvents.push(calendarEntry)
      }
    }

    // TODO : extra
    // TODO : assign
    // TODO : coures

    var response = {
      status: 'success',
      calendar: calendarEvents
    };

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response))
  }

  private getTimeBlocksFromRepeatingEvent(eventData : any, lastAssignmentDue : number) : any[] {
    // super simple, lets just iterate over every day.

    let occurrences = [];

    let now : number = Date.now()
    let day = new Date();
    day.setHours(0, 0, 0, 0)

    // need every occurance of the event between now and lastAssignmentDue
    while (day.getTime() < lastAssignmentDue) {

      let dayOfWeek = day.getDay()

      if (eventData.daysOfWeek.map((x : any) => parseInt(x)).includes(dayOfWeek)) {

        // this is jank
        let startString = day.toDateString() + ' ' + eventData.start
        let startDate = new Date(startString)

        let endString = day.toDateString() + ' ' + eventData.end
        let endDate = new Date(endString)

        if (endDate.getTime() < startDate.getTime())
          endDate.setDate(endDate.getDate() + 1)

        let timeBlock = {
          start: startDate.getTime(),
          end: endDate.getTime(),
        }
        occurrences.push(timeBlock)
      }

      day.setDate(day.getDate() + 1)
    }

    return occurrences
  };

  private getAssignmentStartTimes(assignments : Assignment[], timeInfos : any[]) {
    /*
    timeBlock = {
      start: utc,
      end: utc
    }*/

    if (assignments.length == 0) return [];

    // put in reverse
    assignments.sort((a, b) => {
      return b.due - a.due
    })

    let lastAssignmentDue = assignments[0].due;

    let timeBlocks : any[] = [];
    for (let timeInfo of timeInfos) {
      if (timeInfo.daysOfWeek !== undefined) {
        let blocks = this.getTimeBlocksFromRepeatingEvent(timeInfo, lastAssignmentDue);
        timeBlocks = timeBlocks.concat(blocks)
      } else {
        timeBlocks.push(timeInfo)
      }
    }

    timeBlocks.sort((a, b) => {
      return a.end - b.end;
    });

    let res : any[] = [];

    while (timeBlocks.length > 0 && timeBlocks[timeBlocks.length - 1].start > lastAssignmentDue) {
      timeBlocks.pop()
    }

    let startTime = assignments[0].due;
    for (let assignment of assignments) {
      if (startTime > assignment.due)
        startTime = assignment.due


      let nextTimeBlock = timeBlocks[timeBlocks.length - 1]

      let splits = [];

      // amount of assignment completed
      let remaining = (assignment.ttc * 3600 * 1000);
      while (remaining > 0 && timeBlocks.length > 0) {

        // how much time do we have between the next time block and now?
        let nextEnd = nextTimeBlock.end;
        let freeTime = startTime - nextEnd;
        freeTime = Math.min(freeTime, remaining);

        splits.push({
          startTime: startTime - freeTime,
          duration: freeTime,
        })

        remaining -= freeTime;
        startTime = nextTimeBlock.start;

        timeBlocks.pop()
        if (timeBlocks.length > 0)
          nextTimeBlock = timeBlocks[timeBlocks.length - 1];
        else
          nextTimeBlock = null;
      }

      if (remaining > 0) {
        // no time blocks left
        splits.push({
          startTime: startTime - remaining,
          duration: remaining
        })
        startTime -= remaining;
      }

      let pair = {
        splits: splits,
        assignment: assignment
      }

      if (startTime < Date.now()) break;
      
      res.push(pair)

    }

    return res;
  }
}
