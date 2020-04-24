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

function setupLargeCalendar() : void {
  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
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
