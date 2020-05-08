# Team ETA #

## PlanIt - The Scheduling App! ##
## CS326 Spring 2020 ##
------

## Overview: What is PlanIt? ##
The idea with PlanIt is to innovate a new type of scheduling app. See, there are a ton of apps and websites on the internet that let you write down the things you need to do and check them off. What makes PlanIt different is the greedy job-scheduling algorithm! PlanIt takes into account all of your due dates, expected times of completion, and other things to focus you in on one task to do - the optimal one. What task makes most sense to do right now? PlanIt - the smart planner.

## Team Members ##
___
|Member|GitHub Alias|
|------|------------|
|Kyle Silverman|*KSilverman*|
|Devon Endicott|*dpendic*|
|Artem Aleksanyan|*aaleksanyan*|

## User Interface ##
___
PlanIt's user interface strives to be as user-friendly as possible. After logging in, you are immediately presented with your calendar and your first queued task. Easy!

### Login ###
This is where you log into your PlanIt account. Click register after entering a username and password to create an account and click login to enter.

Login screen | Registered account!
:------------:|:------------------:
![login](https://github.com/KSilverman/cs326-final-eta/blob/master/static/img/final-login.PNG) | ![reg](https://github.com/KSilverman/cs326-final-eta/blob/master/static/img/final-login-registered.PNG)

### Dashboard ###
This is your home page on PlanIt. At the top of the page you see a calendar which has your schedule on it as well as due dates. Look further down and see your feed with all the assignments you have entered, sorted by optimal completion order with all the information you need at a glance. To your right, you can add or delete courses.

![dash](https://github.com/KSilverman/cs326-final-eta/blob/master/static/img/final-dash.PNG)

### Add/Delete/Edit ###
Here, we have a modal pop up and present an easy way to enter all your information. Add and edit both pop up the same type of field to maintain a consistent design. The red delete button will remove your assignment from the database.

Course| Assignment | Extra-curricular | Exam
:----:|:----------:|:----------------:|:----:
![courseAdd][course]|![assignmentAdd][ass]|![extracurricAdd][ec]|![examAdd][exam]

[course]: https://github.com/KSilverman/cs326-final-eta/blob/master/static/img/final-addcourse.PNG "course"
[ass]: https://github.com/KSilverman/cs326-final-eta/blob/master/static/img/final-addassignment.PNG "ass"
[ec]: https://github.com/KSilverman/cs326-final-eta/blob/master/static/img/final-addec.PNG "ec"
[exam]: https://github.com/KSilverman/cs326-final-eta/blob/master/static/img/final-addexam.PNG "exam"

## APIs ##
___
**General**
|API|Utility|
|--------|-------|
|`/user/register`|POST registration data|
|`/user/login`|POST login info|
|`/user/:uid`|Gets user data of user with id `uid`|
|`/user/:uid/calendar`|Returns the events to populate the calendar with (when logged in)|

**Course** (all require login)
|API|Utility|
|----|----|
|`/api/course/all`|Gets all courses associated with the user|
|`/api/course/:id`|Gets the course with the specified course id|
|`/api/course/create`|Creates a new course from POST data|
|`/api/course/update`|Updates a course|
|`/api/course/delete`|Deletes a course|

**Assignment** (all require login)
|API|Utility|
|----|----|
|`/api/assignment/all`|Gets all assignments associated with the user|
|`/api/assignment/:id`|Gets the assignment with the specified assignment id|
|`/api/assignment/create`|Creates a new assignment from POST data|
|`/api/assignment/update`|Updates an assignment|
|`/api/assignment/delete`|Deletes an assignment|

**Extracurricular** (all require login)
|API|Utility|
|----|----|
|`/api/extracurricular/all`|Gets all extracurriculars associated with the user|
|`/api/extracurricular/:id`|Gets the extracurricular with the specified extracurricular id|
|`/api/extracurricular/create`|Creates a new extracurricular from POST data|
|`/api/extracurricular/update`|Updates an extracurricular|
|`/api/extracurricular/delete`|Deletes an extracurricular|

**Exam** (all require login)
|API|Utility|
|----|----|
|`/api/exam/all`|Gets all exams associated with the user|
|`/api/exam/:id`|Gets the exam with the specified exam id|
|`/api/exam/create`|Creates a new exam from POST data|
|`/api/exam/update`|Updates an exam|
|`/api//exam/delete`|Deletes an exam|

## Database ##
___
The database structure is as follows:

**Users**
|id|name|hash|
|---|---|---|
|Unique identifier|User's name|Hashed password|

**Exams**
|id|uid|name|calendarData|
|---|---|---|---|
|Unique identifier|User ID - linked to Users|Name of exam|When exam is|

**Courses**
|id|uid|name|calendarData|
|---|---|---|---|
|Unique identifier|User ID - linked to Users|Name of course|Course times|

**Extracurriculars**
|id|uid|name|calendarData|note|
|---|---|---|---|---|
|Unique identifier|User ID - linked to Users|Name of e.c.|When it takes place|Note about e.c.|

**Assignments**
|id|uid|name|classID|note|timeToCompletion|
|---|---|---|---|---|---|
|Unique identifier|User ID - linked to Users|Name of assignment|Class ID - linked to Courses|Note about assignment|Estimated time to completion|

## URL Routes/Mappings ##
___
## Authentication/Authorization ##
___
Users are authenticated by entering their username and password in the login page. After the information is confirmed, a session is created. This active session is required to access any information pertaining to the user - their calendar, their events, their exams. Every call to the database is preceded by a check to ensure that the `_uid` session is active.

The user's password is stored as a hash in the database, in the user table under 'hash'.

## Division of Labor ##
___
Kyle -- Building and deployment, front end design, client side typescript implementation for CRUD operations, backend CRUD operations, database implemenation

Devon -- Database, Calendar system, User authentication and session, User/Assignment/Courses CRUD frontend and backend, Extracurricular/Exam CRUD backend, Server routing and responses, scheduling algorithm

Artem -- Helped brainstorm overall format and layout of site. Found icon. Made index.html. Populated skeleton code in types folder. Populated functions in database.ts. Populated functions in server.ts. Did this write-up.

## Conclusion ##
___
Creating PlanIt was an unexpectedly large challenge considering how simple the core concept was. It turned out that while the job-scheduling algorithm was the novelty behind this project, creating the rest of the basic functionality was the biggest task.

The design process was fairly straightforward. It turns out that with a group this small, collaborating and hashing out exactly what sort of functionality we would like to see had very little conflict overall and was easy to figure out. Following this, creating the UI visually was very easy - all it took was a little bit of fiddling with Bootstrap code. Populating the feed and the database and making all the buttons and modals actually store the data was a large hurdle. Creating this basic functionality took a *lot* longer than it felt like it should -- simple doesn't mean easy.

Something that plagued this project a lot was basic technology issues. While we were editing code together, oftentimes GitHub would not allow us to pull or to merge without reverting changes and it wasn't always clear what the problem was. If we were to do it again, we might consider doing this project with branches instead of everyone commiting directly to the master branch. The project also did not work on everyone's machines with all other things equal at certain steps, with no indication of why and what the problem was. These challenges were really frustrating considering they were just blocks to actually doing work - not issues with the actual work itself. Which, one could argue, is a part of a project in itself. Workflow is extremely important, and this project taught us that it is much harder to manage than it looks.

This project was ultimately an exercise in self-managing. There's no getting around the fact that organizing code, managing time, and working out small but deadly kinks were major pitfalls in working on this project. The exercise taught us a lot and in the future, we hope to have a lovely smart little planner like PlanIt to help us keep track of things.
