const login = document.getElementById('loginbtn');

login.addEventListener('click', loginfunction);

async function loginfunction() {

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const userDetails = {
        email: email,
        password: password
    }
    document.getElementById('email').value = "";
    document.getElementById('password').value = "";

    try {
        const response = await axios.post('http://localhost:4000/user/login', userDetails);
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


