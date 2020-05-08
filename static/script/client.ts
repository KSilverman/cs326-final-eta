//Get email and password from index.html and send to server
const url : string = ""
var userId = 11; // temp

function login(){
    (async() => {
        let usernameField = document.getElementById("username") as HTMLInputElement;
        let username = usernameField.value;

        let pwfield = document.getElementById("password") as HTMLInputElement;
        let pw = pwfield.value;

        const login = {'name':username, 'password':pw}
        const newURL = url + "/user/login";
        const resp = await postData(newURL, login);
        console.log(resp)
        const j = await resp.json()
        if (j['status'] == 'failed'){
            let err = document.getElementById("login_resp") as HTMLElement;
            err.className = "";
            err.classList.add("alert");
            err.classList.add("alert-danger");
            err.innerHTML = "<p>" + j.message + "</p>";
        } else{
            window.location.href = url + "/dashboard";
        }
    })();
}

async function register() : Promise<void> {
  let usernameElement = document.getElementById("username") as HTMLInputElement;
  let passwordElement = document.getElementById("password") as HTMLInputElement;
  let username : string = usernameElement.value;
  let password : string = passwordElement.value;

  let data = {
    name: username,
    password: password
  }

  var resp = await postData('/user/register', data);
  var obj = await resp.json()

  let err = document.getElementById("login_resp") as HTMLElement;

  if (obj.status != 'success')
  {
    err.className = "";
    err.classList.add("alert");
    err.classList.add("alert-danger");
    err.innerHTML = "<p>" + obj.message + "</p>";
  }
  else
  {
    err.className = "";
    err.classList.add("alert");
    err.classList.add("alert-success");
    err.innerHTML = "<p>Registration successful! Please login</p>";
  }
}

var FullCalendar : any;
var calendar : any;

async function setupLargeCalendar() : Promise<void> {
  var calendarEl = document.getElementById('calendar');

  calendar = new FullCalendar.Calendar(calendarEl, {
    plugins: [ 'dayGrid' ],

    // for week view
    // defaultView: 'dayGridWeek',
    // height: 350
  });

  calendar.render();
}

function setupDashboardCalendar() : void {
  var calendarEl = document.getElementById('calendar');

  calendar = new FullCalendar.Calendar(calendarEl, {
    plugins: [ 'timeGrid' ],
    defaultView: 'timeGridWeek',
    height: 400,
    scrollTime: Date.now(),
    slotDuration: '00:30:00',
    allDaySlot: false
  });

  calendar.render();
}

async function updateCalendar() : Promise<void> {
  var resp = await postData('/api/calendar', {});
  var obj = await resp.json();

  if (obj.status != 'success') {
    console.error('Failed to poll calendar');
    return;
  }

  calendar.removeAllEvents();

  var calendarElements = obj.calendar;

  if (!calendarElements) {
    console.error('Calendar response did not include elements');
    return;
  }


  for (var element of calendarElements) {
    calendar.addEvent(element.event)
  }

  calendar.render();
}

async function updateAssignments() : Promise<void> {
  var resp = await postData('/api/assignment/all', {});

  console.log(resp);

  var obj = await resp.json();

  console.log(obj);

  if (obj.status == 'unauthorized') {
    window.location.href = '/'
  }

  if (obj.status != 'success') {
    console.error('Failed to poll assignments');
    return;
  }

  var categories = obj.categories;

  var html : string = '';

  for (var category of categories) {
    var title : string = category.title;
    var assignments = category.assignments;

    html += '<div class="row"> <div class="col-sm h1 py-1 text-center">';
    html += title;
    html += '</div></div>';

    html += '<div class="row"><div class="col-xl outline table-responsive"><table class="table"><thead><tr>';
    html += '<th scope="col">#</th>'
    html += '<th scope="col">Name</th>'
    html += '<th scope="col">Class</th>'
    html += '<th scope="col">Due Date</th>'
    html += '<th scope="col">Expected TTC</th>'
    html += '<th scope="col">Notes</th>'
    html += '<th scope="col">Actions</th>'
    html += '</tr></thead><tbody>';

    for (var assignment of assignments) {
      console.log(assignment)
      var assignmentTitle : string = assignment.name;
      var courseId : number = assignment.course;

      var course = await getCourseName(courseId);

      var dueDate : Date = new Date(assignment.due)
      var dateFormatOptions = {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }
      var dueDateStr : string = new Intl.DateTimeFormat('en-US', dateFormatOptions).format(dueDate);

      var expectedTTC : string = assignment.ttc;
      var notes : string = assignment.note;

      html += '<tr class="table-danger">';
      html += '<th scope="row">1</th>'
      html += '<td>' + assignmentTitle + '</td>'
      html += '<td>' + course + '</td>'
      html += '<td>' + dueDateStr + '</td>'
      html += '<td>' + expectedTTC + '</td>'
      html += '<td>' + notes + '</td>'
      html += '<td><button type="button" class="btn btn-success btn-sm" title="Completed">&#10004;</button>';
      html += '<button type="button" class="btn btn-primary btn-sm" title="Edit">&#9997;</button>';
      html += '<button type="button" class="btn btn-danger btn-sm" title="Remove" onclick="deleteAssignmentButton(' + assignment.id + ')">&#10006;</button></td></tr>';
    }

    html += '</tbody></table></div></div>';
  }


  let assignmentContainer = document.getElementById("assignments") as HTMLElement;
  assignmentContainer.innerHTML = html;
}

function createAssignmentButton() {
  let nameElement = document.getElementById('assignment-name') as HTMLInputElement;
  let classElement = document.getElementById('class-pick') as HTMLInputElement;
  let dateElement = document.getElementById('date') as HTMLInputElement;
  let timeElement = document.getElementById('time') as HTMLInputElement;
  let ttcElement = document.getElementById('ttc') as HTMLInputElement;
  let notesElement = document.getElementById('notes') as HTMLInputElement;

  let date = dateElement.value;
  let time = timeElement.value;

  let due = Date.parse(date + ' ' + time)

  let name = nameElement.value;
  let course = parseInt(classElement.value) || 3;
  // let due = 0;//dueElement.value;
  let ttc = parseInt(ttcElement.value) || 1;
  let notes = notesElement.value;

  createAssignment(name, due, ttc, course, notes)
}

async function createAssignment(name : string, due : number, ttc : number, courseId : number, notes : string) {
  let payload : object = {
    name: name,
    due: due,
    ttc: ttc,
    courseId: courseId,
    note: notes
  }

  var resp = await postData('/api/assignment/create', payload);

  let obj = await resp.json()

  if (obj.status == 'success') {
    updateAssignments()
		updateCalendar()
  }
}

async function editAssignment(assId: string, name : string, due : number, ttc : number, courseId : number, notes : string) {
  let payload : object = {
    assId: assId,
    name: name,
    due: due,
    ttc: ttc,
    courseId: courseId,
    note: notes
  }

  var resp = await postData('/api/assignment/'+assId+'/update', payload);

  let obj = await resp.json()

  if (obj.status == 'success') {
    updateAssignments()
    updateCalendar()
  }
}

function deleteAssignmentButton(id : number) {
  deleteAssignment(id);
}

async function deleteAssignment(id : number) {
  var resp = await postData('/api/assignment/' + id + '/delete', {});

  let obj = await resp.json()

  if (obj.status == 'success') {
    updateAssignments()
  }
}

function clearActivePanels()
{
  let panels : any = document.getElementById('panels');
  for(let p of panels.childNodes)
  {
    if(p != null && typeof p !== 'undefined' && p.nodeName != '#text') {
      console.log(p)
      p.classList.remove("active");
    }
  }
}

function showAss()
{
  clearActivePanels();
  let assPanel : any = document.getElementById('assignments');
  assPanel.classList.add("active");
}

function showEcs()
{
  clearActivePanels();
  let assPanel : any = document.getElementById('extracurriculars');
  assPanel.classList.add("active");
}

function showExs()
{
  clearActivePanels();
  let assPanel : any = document.getElementById('exams');
  assPanel.classList.add("active");
}

function showComp()
{
  clearActivePanels();
  let assPanel : any = document.getElementById('completed');
  assPanel.classList.add("active");
}

// NEW: helper method for posting data
async function postData(url : string, data : any) {
  if (!data) data = {}
  const resp = await fetch(url,
    {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    body: JSON.stringify(data)
  });
  return resp;
}
