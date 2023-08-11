const backendApi = "https://16.170.212.225:4000";

const password = document.getElementById("password");
const showPwdCheck = document.getElementById('showPwd').addEventListener('click', showPassword);
 function showPassword() {
    if (password.type === "password") {
        password.type = "text";
      } else {
        password.type = "password";
      }
 }

const login = document.getElementById('form');
login.addEventListener('submit', loginfunction);

async function loginfunction(event) {

    event.preventDefault();
    const errorContainer = document.getElementById('error-container');
    errorContainer.innerHTML = "";

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const userDetails = {
        email: email,
        password: password
    }
    document.getElementById('email').value = "";
    document.getElementById('password').value = "";

    try {
        const response = await axios.post(`${backendApi}/user/login`, userDetails);
        alert(response.data.message);
        localStorage.setItem('token', response.data.token);
        window.location.href = '../Index/index.html'
    }
    catch (err) {
        console.log(err);
        if (err.response && err.response.data) {
            const errorMessage = err.response.data.error;
            const errorContainer = document.getElementById('error-container');
            errorContainer.innerHTML = `<h4>${errorMessage}</h4>`;
        } else {
            // Handle other types of errors
            const errorContainer = document.getElementById('error-container');
            errorContainer.innerHTML = "<h4>An error occurred. Please try again later.</h4>";
        }
    }
}


