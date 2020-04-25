//Get email and password from index.html and send to server
const url : string = ""
var userId = 11; // temp

function login(){
    (async() => {
        let emailField = document.getElementById("emailaddress") as HTMLInputElement;
        let email = emailField.value;

        let pwfield = document.getElementById("password") as HTMLInputElement;
        let pw = pwfield.value;

        const login = {'email':email, 'password':pw}
        const newURL = url + "/users/login";
        const resp = await postData(newURL, login);
        const j = await resp.json()
        if (j['status'] == 'failed'){
            let err = document.getElementById("errorlogin") as HTMLElement;
            err.innerHTML = "<p>Login failed!</p>";
        } else{
            window.location.href = url + "/dashboard";
        }
    })();
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
    plugins: [ 'dayGrid' ],

    // for week view
    defaultView: 'dayGridWeek',
    height: 320
  });

  calendar.render();
}

async function updateCalendar() : Promise<void> {
  var resp = await postData('/user/' + userId + '/calendar', '');
  var obj = await resp.json();

  if (obj.status != 'success') {
    console.error('Failed to poll calendar');
    return;
  }

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
  var resp = await postData('/user/' + userId + '/assignment/all', '');
  var obj = await resp.json();

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
      var assignmentTitle : string = assignment.title;
      var course : string = assignment.course.title;
      var classId : string = assignment.course.id;
      var dueDate : string = assignment.dueDate;
      var expectedTTC : string = assignment.expectedTTC;
      var notes : string = assignment.notes;

      html += '<tr class="table-danger">';
      html += '<th scope="row">1</th>'
      html += '<td>' + assignmentTitle + '</td>'
      html += '<td>' + course + '</td>'
      html += '<td>' + dueDate + '</td>'
      html += '<td>' + expectedTTC + '</td>'
      html += '<td>' + notes + '</td>'
      html += '<td><button type="button" class="btn btn-success btn-sm" title="Completed">&#10004;</button><button type="button" class="btn btn-primary btn-sm" title="Edit">&#9997;</button><button type="button" class="btn btn-danger btn-sm" title="Remove">&#10006;</button></td></tr>';
    }

    html += '</tbody></table></div></div>';
  }


  let assignmentContainer = document.getElementById("assignments") as HTMLElement;
  assignmentContainer.innerHTML = html;
}

// NEW: helper method for posting data
async function postData(url : string, data : any) {
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