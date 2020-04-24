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
