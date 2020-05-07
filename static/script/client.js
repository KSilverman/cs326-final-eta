var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//Get email and password from index.html and send to server
const url = "";
var userId = 11; // temp
function login() {
    (() => __awaiter(this, void 0, void 0, function* () {
        let usernameField = document.getElementById("username");
        let username = usernameField.value;
        let pwfield = document.getElementById("password");
        let pw = pwfield.value;
        const login = { 'name': username, 'password': pw };
        const newURL = url + "/user/login";
        const resp = yield postData(newURL, login);
        console.log(resp);
        const j = yield resp.json();
        if (j['status'] == 'failed') {
            let err = document.getElementById("login_resp");
            err.className = "";
            err.classList.add("alert");
            err.classList.add("alert-danger");
            err.innerHTML = "<p>" + j.message + "</p>";
        }
        else {
            window.location.href = url + "/dashboard";
        }
    }))();
}
function register() {
    return __awaiter(this, void 0, void 0, function* () {
        let usernameElement = document.getElementById("username");
        let passwordElement = document.getElementById("password");
        let username = usernameElement.value;
        let password = passwordElement.value;
        let data = {
            name: username,
            password: password
        };
        var resp = yield postData('/user/register', data);
        var obj = yield resp.json();
        let err = document.getElementById("login_resp");
        if (obj.status != 'success') {
            err.className = "";
            err.classList.add("alert");
            err.classList.add("alert-danger");
            err.innerHTML = "<p>" + obj.message + "</p>";
        }
        else {
            err.className = "";
            err.classList.add("alert");
            err.classList.add("alert-success");
            err.innerHTML = "<p>Registration successful! Please login</p>";
        }
    });
}
var FullCalendar;
var calendar;
function setupLargeCalendar() {
    return __awaiter(this, void 0, void 0, function* () {
        var calendarEl = document.getElementById('calendar');
        calendar = new FullCalendar.Calendar(calendarEl, {
            plugins: ['dayGrid'],
        });
        calendar.render();
    });
}
function setupDashboardCalendar() {
    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: ['dayGrid'],
        // for week view
        defaultView: 'dayGridWeek',
        height: 320
    });
    calendar.render();
}
function updateCalendar() {
    return __awaiter(this, void 0, void 0, function* () {
        var resp = yield postData('/api/calendar', {});
        var obj = yield resp.json();
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
            calendar.addEvent(element.event);
        }
        calendar.render();
    });
}
function updateAssignments() {
    return __awaiter(this, void 0, void 0, function* () {
        var resp = yield postData('/api/assignment/all', {});
        console.log(resp);
        var obj = yield resp.json();
        console.log(obj);
        if (obj.status == 'unauthorized') {
            window.location.href = '/';
        }
        if (obj.status != 'success') {
            console.error('Failed to poll assignments');
            return;
        }
        var categories = obj.categories;
        var html = '';
        /*
          let assignments_input = [];
        
          for(let cat of categories)
          {
            for(let ass of assignments)
            {
                assignments_input.push(ass);
            }
          }
        
          let ordered_assignments = getOrderedAssignmentsWithCats(assignments_input);
          */
        for (var category of categories) {
            var title = category.title;
            var assignments = category.assignments;
            html += '<div class="row"> <div class="col-sm h1 py-1 text-center">';
            html += title;
            html += '</div></div>';
            html += '<div class="row"><div class="col-xl outline table-responsive"><table class="table"><thead><tr>';
            html += '<th scope="col">#</th>';
            html += '<th scope="col">Name</th>';
            html += '<th scope="col">Class</th>';
            html += '<th scope="col">Due Date</th>';
            html += '<th scope="col">Expected TTC</th>';
            html += '<th scope="col">Notes</th>';
            html += '<th scope="col">Actions</th>';
            html += '</tr></thead><tbody>';
            for (var assignment of assignments) {
                var assignmentTitle = assignment.title;
                var course = assignment.course.title;
                var classId = assignment.course.id;
                var dueDate = assignment.dueDate;
                var expectedTTC = assignment.expectedTTC;
                var notes = assignment.notes;
                html += '<tr class="table-danger">';
                html += '<th scope="row">1</th>';
                html += '<td>' + assignmentTitle + '</td>';
                html += '<td>' + course + '</td>';
                html += '<td>' + dueDate + '</td>';
                html += '<td>' + expectedTTC + '</td>';
                html += '<td>' + notes + '</td>';
                html += '<td><button type="button" class="btn btn-success btn-sm" title="Completed">&#10004;</button><button type="button" class="btn btn-primary btn-sm" title="Edit">&#9997;</button><button type="button" class="btn btn-danger btn-sm" title="Remove">&#10006;</button></td></tr>';
            }
            html += '</tbody></table></div></div>';
        }
        let assignmentContainer = document.getElementById("assignments");
        assignmentContainer.innerHTML = html;
    });
}
function createAssignmentButton() {
    let nameElement = document.getElementById('assignment-name');
    let classElement = document.getElementById('class-pick');
    let dueElement = document.getElementById('date');
    let ttcElement = document.getElementById('ttc');
    let notesElement = document.getElementById('notes');
    let name = nameElement.value;
    let course = parseInt(classElement.value);
    let due = 0; //dueElement.value;
    let ttc = 0; //ttcElement.value;
    let notes = notesElement.value;
    createAssignment(name, due, ttc, course, notes);
}
function createAssignment(name, due, ttc, classId, notes) {
    return __awaiter(this, void 0, void 0, function* () {
        let payload = {
            name: name,
            due: due,
            ttc: ttc,
            classId: classId,
            notes: notes
        };
        var resp = yield postData('/api/assignment/create', payload);
        console.log(resp.text());
        // TODO this is bad?
        updateAssignments();
    });
}
/*
function getOrderedAssignmentsWithCats(list : any[]) : any[]
{
  let ordered_list : any[] = [];

  for(let i : number = 0; i < list.length; i++)
  {
      //TODO: Order assignment list
  }

  return ordered_list;
}
*/
// NEW: helper method for posting data
function postData(url, data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!data)
            data = {};
        const resp = yield fetch(url, {
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
    });
}
