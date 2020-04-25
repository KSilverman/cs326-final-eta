# Milestone 2 #

## Division of Labor ##

Kyle - Courses, Edit/Update Modals
Devon - Calendar, Assignment population
Artem - User/Login

## APIS ##

`/user/register`

POST registration data

`/user/login`

POST login info

`/user/:uid`

Gets user data of user with id `uid`


### Course ###

`/user/:uid/course/all`

Gets all courses associated with the user

`/user/:uid/course/:id`

Gets the course with the specified course id

`/user/:uid/course/create`

Creates a new course from POST data

`/user/:uid/course/update`

Updates a course

`/user/:uid/course/delete`

Deletes a course


### Assignment ###

`/user/:uid/assignment/all`

Gets all assignments associated with the user

`/user/:uid/assignment/:id`

Gets the assignment with the specified assignment id

`/user/:uid/assignment/create`

Creates a new assignment from POST data

`/user/:uid/assignment/update`

Updates an assignment

`/user/:uid/assignment/delete`

Deletes an assignment



### Extracurricular ###

`/user/:uid/extracurricular/all`

Gets all extracurriculars associated with the user

`/user/:uid/extracurricular/:id`

Gets the extracurricular with the specified extracurricular id

`/user/:uid/extracurricular/create`

Creates a new extracurricular from POST data

`/user/:uid/extracurricular/update`

Updates an extracurricular

`/user/:uid/extracurricular/delete`

Deletes an extracurricular



### Exam ###

`/user/:uid/exam/all`

Gets all exams associated with the user

`/user/:uid/exam/:id`

Gets the exam with the specified exam id

`/user/:uid/exam/create`

Creates a new exam from POST data

`/user/:uid/exam/update`

Updates a exam

`/user/:uid/exam/delete`

Deletes a exam
