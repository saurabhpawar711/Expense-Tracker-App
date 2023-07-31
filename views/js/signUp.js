async function signUp(event) {

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const userDetails = {
        name: name,
        email: email,
        password: password
    }
    document.getElementById('name').value = "";
    document.getElementById('email').value = "";
    document.getElementById('password').value = "";

    try {
        const response = await axios
            .post('http://localhost:3000/user/signup', userDetails);
            if(response.data.success) {
                alert('You have successfully created account');
                window.location.href = '../views/login.html';
            }
    }
    catch (err) {
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