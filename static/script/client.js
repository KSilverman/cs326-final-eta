var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
//Get email and password from index.html and send to server
var url = "";
var userId = 11; // temp
function login() {
    var _this = this;
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var emailField, email, pwfield, pw, login, newURL, resp, j, err;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    emailField = document.getElementById("emailaddress");
                    email = emailField.value;
                    pwfield = document.getElementById("password");
                    pw = pwfield.value;
                    login = { 'email': email, 'password': pw };
                    newURL = url + "/users/login";
                    return [4 /*yield*/, postData(newURL, login)];
                case 1:
                    resp = _a.sent();
                    return [4 /*yield*/, resp.json()];
                case 2:
                    j = _a.sent();
                    if (j['status'] == 'failed') {
                        err = document.getElementById("errorlogin");
                        err.innerHTML = "<p>Login failed!</p>";
                    }
                    else {
                        window.location.href = url + "/dashboard";
                    }
                    return [2 /*return*/];
            }
        });
    }); })();
}
var FullCalendar;
var calendar;
function setupLargeCalendar() {
    return __awaiter(this, void 0, void 0, function () {
        var calendarEl;
        return __generator(this, function (_a) {
            calendarEl = document.getElementById('calendar');
            calendar = new FullCalendar.Calendar(calendarEl, {
                plugins: ['dayGrid']
            });
            calendar.render();
            return [2 /*return*/];
        });
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
    return __awaiter(this, void 0, void 0, function () {
        var resp, obj, calendarElements, _i, calendarElements_1, element;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, postData('/user/' + userId + '/calendar', '')];
                case 1:
                    resp = _a.sent();
                    return [4 /*yield*/, resp.json()];
                case 2:
                    obj = _a.sent();
                    if (obj.status != 'success') {
                        console.error('Failed to poll calendar');
                        return [2 /*return*/];
                    }
                    calendarElements = obj.calendar;
                    if (!calendarElements) {
                        console.error('Calendar response did not include elements');
                        return [2 /*return*/];
                    }
                    for (_i = 0, calendarElements_1 = calendarElements; _i < calendarElements_1.length; _i++) {
                        element = calendarElements_1[_i];
                        calendar.addEvent(element.event);
                    }
                    calendar.render();
                    return [2 /*return*/];
            }
        });
    });
}
function updateAssignments() {
    return __awaiter(this, void 0, void 0, function () {
        var resp, obj, categories, html, _i, categories_1, category, title, assignments, _a, assignments_1, assignment, assignmentTitle, course, classId, dueDate, expectedTTC, notes, assignmentContainer;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, postData('/user/' + userId + '/assignment/all', '')];
                case 1:
                    resp = _b.sent();
                    return [4 /*yield*/, resp.json()];
                case 2:
                    obj = _b.sent();
                    if (obj.status != 'success') {
                        console.error('Failed to poll assignments');
                        return [2 /*return*/];
                    }
                    console.log(obj.status);
                    console.log(obj);
                    categories = obj.categories;
                    html = '';
                    for (_i = 0, categories_1 = categories; _i < categories_1.length; _i++) {
                        category = categories_1[_i];
                        title = category.title;
                        assignments = category.assignments;
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
                        for (_a = 0, assignments_1 = assignments; _a < assignments_1.length; _a++) {
                            assignment = assignments_1[_a];
                            assignmentTitle = assignment.title;
                            course = assignment.course.title;
                            classId = assignment.course.id;
                            dueDate = assignment.dueDate;
                            expectedTTC = assignment.expectedTTC;
                            notes = assignment.notes;
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
                    assignmentContainer = document.getElementById("assignments");
                    assignmentContainer.innerHTML = html;
                    return [2 /*return*/];
            }
        });
    });
}
// NEW: helper method for posting data
function postData(url, data) {
    return __awaiter(this, void 0, void 0, function () {
        var resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(url, {
                        method: 'POST',
                        mode: 'cors',
                        cache: 'no-cache',
                        credentials: 'same-origin',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        redirect: 'follow',
                        body: JSON.stringify(data)
                    })];
                case 1:
                    resp = _a.sent();
                    return [2 /*return*/, resp];
            }
        });
    });
}
