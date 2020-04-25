//const url = "http://localhost:80/";

/*async function postData(url: string, data: string) {
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
}*/

async function getCourses(uuid: any) : Promise<void>
{
	(async () => {
		const data = '{ \'uid\' : uuid }';
		const newURL = url + "user/:"+uuid+"/course/all";
		console.log("Sending courses request to " + newURL);
		const resp = await postData(newURL, '');
		const j = await resp.json();
		let course_list = document.getElementById("courses") as HTMLElement;
		let course_options = document.getElementById("class-pick") as HTMLElement;
		if (j.status !== 'error') 
		{
			if(j.courses.length == 0)
			{
				console.log("No courses found for user " + uuid);
				course_list.innerHTML = '<li class="list-group-item d-flex justify-content-between"> <b>No Courses Found</b></li><li class="list-group-item d-flex justify-content-center"><button type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#addClass">Add Class</button></li>';
			}
			else
			{
				console.log("Courses found for user " + uuid);
				let courses: string = "";
				for(let i: number = 0; i < j.courses.length; i++)
				{
					courses += '<li class="list-group-item d-flex justify-content-between"> <b>'+j.courses[i].title+'</b><button type="button" class="btn btn-danger btn-sm">Remove</button></li>';
				}
				courses += '<li class="list-group-item d-flex justify-content-center"><button type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#addClass">Add Class</button></li>';
				course_list.innerHTML = courses;
			}
			let course_picks: string = "";
			for(let i: number = 0; i < j.courses.length; i++)
			{
				course_picks += '<option>'+j.courses[i].title+'</option>';
			}
			course_options.innerHTML = course_picks;
		} 
		else 
		{
			console.log("Error on post request for user courses");
		    course_list.innerHTML = '<li class="list-group-item d-flex justify-content-between"> <b>Error Fetching Courses</b></li>';
		}
    })();
}