# Team Eta #

## PlanIt ##

### Group Members ###
Kyle Silverman: KSilverman

Devon Endicott: dpendic

Artem Aleksanyan: aaleksanyan

### Innovative Idea ###
A website that helps you manage academic workload by inputing your classes, exam schedule, and assignments. It would give you rundowns on what assignments you need to do today, the the near future, in the distant future, and it would help notify you when you’re in over your head and are about to procrastinate too much. It does this via a job scheduling algorithm.

### Important Components ###
Users will be faced with a login page when they first arrive to the page. After they input their username and password, they will be faced with their dashboard.

Each user's dashboard will contain two main components - a feed containing their assignments (possibly with different density views), and a calendar with important events an assignments marked. The assignment section will present the user with the suggested order of assignments, as well as some suggestions on ways to break it up.

This data will be stored in a MongoDB containing five documents:

- user (name, pw - hashed), 
- class (name, location, prof, schedule, office hours), 
- extracurricular (name, location, schedule), 
- assignment (name, class, assign date, due date, expected time to complete, notes), and 
- exam (name, class, start time, notes)

Users will be able to query this MongoDB to look for the specific information they need, but the system will also automatically show things it deems necessary.

The suggested order of items will come from the job allocation algorithm. Its input will be the set of jobs (or in this case, assignments), their due dates, and expected time to complete. This will spit out an ordered list of things to do to minimize lateness. You can then mark assignments "complete" so the algorithm no longer takes them into account. The program will then process things to be done and the time needed to complete and allocate time blocks to each assignment as necessary. It might also take into account if the user would like to take a break from one class to work on another, and give the next most pressing assignment on a given time block.
