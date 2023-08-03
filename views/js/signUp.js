const signUp = document.getElementById('signupbtn');

signUp.addEventListener('click', signUpfunction);

async function signUpfunction() {

    const username = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const userDetails = {
        name: username,
        email: email,
        password: password
    }
    document.getElementById('name').value = "";
    document.getElementById('email').value = "";
    document.getElementById('password').value = "";

    try {
        const response = await axios
            .post('http://localhost:4000/user/signup', userDetails);
        if (response.status === 201) {
            alert('You have successfully created account');
            window.location.href = '../html/login.html';
        }
    }
    catch (err) {
        console.log(err);
        if (err.response) {
            const errorMessage = err.response.data.error;
            const errorContainer = document.getElementById('error-container');
            errorContainer.innerHTML = `<h4>${errorMessage}</h4>`;
        }
        else {
            console.log(err);
        }
    }
}