# Milestone 2 #

https://cs326-final-eta.herokuapp.com/dashboard

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


### Misc ###

`/user/:uid/calendar`

Returns the events to populate the calendar with

### Screenshots/usage ###

This pop-up allows you to add a new assignment with a class dropdown, the assignment's name, the due date, expected time to completeion and extra notes. You can also add a new class with another pop-up shown.

![create assignment][create]
![create course][create-course]

Should you for some reason no longer need to have a class, you are able to delete it using the "Remove" button shown here.

![remove course][remove]

All the assignments that are active (that is, in the database and have not been completed) are shown in a ranked list in the table in the bottom of dashboard, seen here:

![assignments][read]

Lastly, if you need to change any information about an assignment or delete it, a user may click the blue button or the red 'x', respectively, to the right of any given assignment. The edit button will open a populated pop-up similar to the one in 'new class'.

![update assignment][update]

[remove]: https://github.com/KSilverman/cs326-final-eta/blob/master/static/img/m2-course-remove.PNG?raw=true "Remove course"
[read]: https://github.com/KSilverman/cs326-final-eta/blob/master/static/img/m2-read.PNG?raw=true "Read assignments"
[update]: https://github.com/KSilverman/cs326-final-eta/blob/master/static/img/m2-update-item.PNG?raw=true "Edit and delete"
[create]: https://github.com/KSilverman/cs326-final-eta/blob/master/static/img/m2-create.png?raw=true "Create assignment"
[create-course]: https://github.com/KSilverman/cs326-final-eta/blob/master/static/img/m2-create-course.PNG?raw=true "Create course"
