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
        let emailField = document.getElementById("emailaddress");
        let email = emailField.value;
        let pwfield = document.getElementById("password");
        let pw = pwfield.value;
        const login = { 'email': email, 'password': pw };
        const newURL = url + "/users/login";
        const resp = yield postData(newURL, login);
        const j = yield resp.json();
        if (j['status'] == 'failed') {
            let err = document.getElementById("errorlogin");
            err.innerHTML = "<p>Login failed!</p>";
        }
        else {
            window.location.href = url + "/dashboard";
        }
    }))();
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
        var resp = yield postData('/user/' + userId + '/calendar', '');
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
        var resp = yield postData('/user/' + userId + '/assignment/all', '');
        var obj = yield resp.json();
        if (obj.status != 'success') {
            console.error('Failed to poll assignments');
            return;
        }
        var categories = obj.categories;
        var html = '';
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
// NEW: helper method for posting data
function postData(url, data) {
    return __awaiter(this, void 0, void 0, function* () {
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
