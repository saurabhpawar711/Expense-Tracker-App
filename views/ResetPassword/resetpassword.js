const resetBtn = document.getElementById('resetBtn');

resetBtn.addEventListener('click', changePassword);

async function changePassword(event) {

    event.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('uI');
    const uuid = urlParams.get('u');

    const changedPassword = document.getElementById('typePassword').value;
    const newPassword = {
        newPassword: changedPassword
    };

    document.getElementById('typePassword').value = "";
    try {
        const response = await axios.post(`http://16.170.78.233:4000/password/updatepassword/${userId}`, newPassword);
        if (response.data.message === 'Yor have successfully changed your password') {
            window.location.href = '../Login/login.html'
        }
    }
    catch (err) {
        console.log(err);
    }
}