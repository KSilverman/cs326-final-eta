//const url = "http://localhost:80/";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
function getCourses(uuid) {
    return __awaiter(this, void 0, void 0, function* () {
        (() => __awaiter(this, void 0, void 0, function* () {
            const data = '{ \'uid\' : uuid }';
            const newURL = url + "user/:" + uuid + "/course/all";
            console.log("Sending courses request to " + newURL);
            const resp = yield postData(newURL, '');
            const j = yield resp.json();
            let course_list = document.getElementById("courses");
            if (j.status !== 'error') {
                if (j.courses.length == 0) {
                    console.log("No courses found for user " + uuid);
                    course_list.innerHTML = '<li class="list-group-item d-flex justify-content-between"> <b>No Courses Found</b></li><li class="list-group-item d-flex justify-content-center"><button type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#addClass">Add Class</button></li>';
                }
                else {
                    console.log("Courses found for user " + uuid);
                    let courses = "";
                    for (let i = 0; i < j.courses.length; i++) {
                        courses += '<li class="list-group-item d-flex justify-content-between"> <b>' + j.courses[i].title + '</b><button type="button" class="btn btn-danger btn-sm">Remove</button></li>';
                    }
                    courses += '<li class="list-group-item d-flex justify-content-center"><button type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#addClass">Add Class</button></li>';
                    course_list.innerHTML = courses;
                }
            }
            else {
                console.log("Error on post request for user courses");
                course_list.innerHTML = '<li class="list-group-item d-flex justify-content-between"> <b>Error Fetching Courses</b></li>';
            }
        }))();
    });
}
