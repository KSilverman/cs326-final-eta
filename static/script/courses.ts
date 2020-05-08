//const url = "http://localhost:80/";

let courses : any[] = [];
let coursesById : any;

async function getCourseName(courseId : number) : Promise<string> {
	if (coursesById == undefined) {
		await getCourses();
	}

	try {
		return coursesById[courseId].title
	} catch(e) {
		return `Unknown (id: ${courseId})`
	}
}

async function getCourses() : Promise<void>
{
	const newURL = '/api/course/all';
	console.log("Sending courses request to " + newURL);
	const resp = await postData(newURL, {});

	console.log(resp)

	const j = await resp.json();

	console.log(j)

	if (j.status == 'unauthorized') {
		//window.location.href = '/'
		return;
	}

	let course_list = document.getElementById("courses") as HTMLElement;
	let course_options = document.getElementById("class-pick") as HTMLElement;
	if (j.status !== 'error')
	{
		courses = j.courses;
		coursesById = {}

		for (let course of courses) {
			coursesById[course.id] = course;
		}

		if(j.courses.length == 0)
		{
			console.log("No courses found ");
			course_list.innerHTML = '<li class="list-group-item d-flex justify-content-center">No Courses. Add one below!</li><li class="list-group-item d-flex justify-content-center"><button type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#addClass">Add Course</button></li>';
		}
		else
		{
			console.log("Courses found");
			let courseHtml: string = "";
			for(let i: number = 0; i < j.courses.length; i++)
			{
				courseHtml += '<li class="list-group-item d-flex justify-content-between"> <b>'+j.courses[i].title+'</b>';
				courseHtml += `<button type="button" class="btn btn-danger btn-sm" onclick="deleteCourseButtion(${j.courses[i].id})">Remove</button></li>`;
			}
			courseHtml += '<li class="list-group-item d-flex justify-content-center"><button type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#addClass">Add Course</button></li>';
			course_list.innerHTML = courseHtml;
		}
		let course_picks: string = "";
		for(let i: number = 0; i < j.courses.length; i++)
		{
			course_picks += `<option value="${j.courses[i].id}">${j.courses[i].title}</option>`;
		}
		course_options.innerHTML = course_picks;
	}
	else
	{
		console.log("Error on post request for user courses");
	    course_list.innerHTML = '<li class="list-group-item d-flex justify-content-between"> <b>Error Fetching Courses</b></li>';
	}
}

async function createCourse(name : string, calendarData : object | null, discussionCalendarData : object | null) {
	let payload : object = {
    name: name,
		calendarData: calendarData,
		discussionCalendarData: discussionCalendarData
  }

  var resp = await postData('/api/course/create', payload);

  let obj = await resp.json()
	console.log(obj)

  if (obj.status == 'success') {
		getCourses()
		updateCalendar()
  }
}

function createCourseButton() {
  let nameElement = document.getElementById('class-name') as HTMLInputElement;
  let name = nameElement.value;

	let daysOfWeek = []
	for (let i = 0; i < 7; i++) {
		let dayElement = document.getElementById('class-day-' + i) as HTMLInputElement;
		if (dayElement.checked) {
			daysOfWeek.push(i)
		}
	}

	let startTimeElement = document.getElementById('class-start') as HTMLInputElement;
	let endTimeElement = document.getElementById('class-end') as HTMLInputElement;

	let startTime = startTimeElement.value
	let endTime = endTimeElement.value

	let courseCalendarData = {
		startTime: startTime,
		endTime: endTime,
		daysOfWeek: daysOfWeek
	}

	let discussionCalendarData = null;

  let hasDiscussionElement = document.getElementById('class-has-discussion') as HTMLInputElement;
	if (hasDiscussionElement.checked) {

			let dstartTimeElement = document.getElementById('class-discussion-start') as HTMLInputElement;
			let dendTimeElement = document.getElementById('class-discussion-end') as HTMLInputElement;
			let dayOfWeekElement = document.getElementById('class-discussion-day') as HTMLInputElement;

			discussionCalendarData = {
				startTime: dstartTimeElement.value,
				endTime: dendTimeElement.value,
				daysOfWeek: [dayOfWeekElement.value]
			}
	}

	if (name) {
		createCourse(name, courseCalendarData, discussionCalendarData)
	}
}



async function deleteCourse(id : number) {
  var resp = await postData('/api/course/' + id + '/delete', {});

  let obj = await resp.json()

  if (obj.status == 'success') {
    getCourses()
		updateCalendar()
  }
}

function deleteCourseButtion(id : number) {
	deleteCourse(id)
}

function showDiscussionSection() {
  let discussionCheckbox = document.getElementById('class-has-discussion') as HTMLInputElement;
  let discussionElement = document.getElementById('class-discussion-options') as HTMLInputElement;
	discussionElement.style.display = discussionCheckbox.checked ? '' : 'none' ;
}
