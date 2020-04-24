//Get email and password from index.html and send to server
const url = ""

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

// NEW: helper method for posting data
async function postData(url, data) {
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
