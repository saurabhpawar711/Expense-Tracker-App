const backendApi = process.env.BACKEND_API;

const login = document.getElementById('form');
login.addEventListener('submit', loginfunction);

async function loginfunction(event) {

    event.preventDefault();

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
        if (response.status === 202) {
            alert(response.data.message);
            localStorage.setItem('token', response.data.token);
            window.location.href = '../html/index.html'
        } else {
            const errorMessage = response.data.message;
            const errorContainer = document.getElementById('error-container');
            errorContainer.innerHTML = `<h4>${errorMessage}</h4>`;
        }
    } catch (err) {
        console.log(err);
        const errorMessage = err.response.data.error;
        const errorContainer = document.getElementById('error-container');
        errorContainer.innerHTML = `<h4>${errorMessage}</h4>`;
    }
}


