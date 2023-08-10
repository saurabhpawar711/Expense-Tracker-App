const backendApi = "http://localhost:4000";

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
        window.location.href = '../html/index.html'
    }
    catch (err) {
        console.log(err);
        const errorMessage = err.response.data.error;
        const errorContainer = document.getElementById('error-container');
        errorContainer.innerHTML = `<h4>${errorMessage}</h4>`;
    }
}


