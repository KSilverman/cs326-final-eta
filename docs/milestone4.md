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

pic

### Dashboard ###
This is your home page on PlanIt. At the top of the page you see a calendar which has your schedule on it as well as due dates. Look further down and see your feed with all the assignments you have entered, sorted by optimal completion order with all the information you need at a glance. To your right, you can add or delete courses.

pic

### Add/Delete/Edit ###
Here, we have a modal pop up and present an easy way to enter all your information. Add and edit both pop up the same type of field to maintain a consistent design. The red delete button will remove your assignment from the database.

pic

## APIs ##
___
**General**
|API|Utility|
|--------|-------|
|`/user/register`|POST registration data|
|`/user/login`|POST login info|
|`/user/:uid`|Gets user data of user with id `uid`|
|`/user/:uid/calendar`|Returns the events to populate the calendar with (when logged in)|

**Course**
|API|Utility|
|----|----|
|`/user/:uid/course/all`|Gets all courses associated with the user|
|`/user/:uid/course/:id`|Gets the course with the specified course id|
|`/user/:uid/course/create`|Creates a new course from POST data|
|`/user/:uid/course/update`|Updates a course|
|`/user/:uid/course/delete`|Deletes a course|

**Assignment**
|API|Utility|
|----|----|
|`/user/:uid/assignment/all`|Gets all assignments associated with the user|
|`/user/:uid/assignment/:id`|Gets the assignment with the specified assignment id|
|`/user/:uid/assignment/create`|Creates a new assignment from POST data|
|`/user/:uid/assignment/update`|Updates an assignment|
|`/user/:uid/assignment/delete`|Deletes an assignment|

**Extracurricular**
|API|Utility|
|----|----|
|`/user/:uid/extracurricular/all`|Gets all extracurriculars associated with the user|
|`/user/:uid/extracurricular/:id`|Gets the extracurricular with the specified extracurricular id|
|`/user/:uid/extracurricular/create`|Creates a new extracurricular from POST data|
|`/user/:uid/extracurricular/update`|Updates an extracurricular|
|`/user/:uid/extracurricular/delete`|Deletes an extracurricular|

**Exam**
|API|Utility|
|----|----|
|`/user/:uid/exam/all`|Gets all exams associated with the user|
|`/user/:uid/exam/:id`|Gets the exam with the specified exam id|
|`/user/:uid/exam/create`|Creates a new exam from POST data|
|`/user/:uid/exam/update`|Updates a exam|
|`/user/:uid/exam/delete`|Deletes a exam|


## Database ##
___
The database structure is as follows:

## URL Routes/Mappings ##
___
## Authentication/Authorization ##
___
## Division of Labor ##
___
## Conclusion ##
___
