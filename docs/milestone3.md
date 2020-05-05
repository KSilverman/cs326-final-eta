# Team Eta #

## Milestone 3 - Database and Back-end ##

### Database Structure ###

Utilizing MongoDB, we have 5 collections; users, assignments, extracurriculars, exams, and courses. All are indexed by an incrementing unique id.

**Users**

*id*

*name*

*hash*

**Exams**

*id*

*uid*

*name*

*calendarData*

**Courses**

*id*

*uid*

*name*

*calendarData*

**Extracurriculars**

*id*

*uid*

*name*

*cal\[endar\]Data*

*note*

**Assignments**

*id*

*uid*

*name*

*classID*

*note*

*timeToCompletion*

### Division of Labor ###

Devon - express routing, user system, database structure; course, user, exam schema

Artem - created extracurricular and assignment schema, getters/setters

Kyle - created MongoDB server on heroku
