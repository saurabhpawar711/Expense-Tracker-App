const resetBtn = document.getElementById('resetBtn');

resetBtn.addEventListener('click', sendMail);

async function sendMail() {
    const email = document.getElementById('typeEmail').value;

    const mailId = {
        email: email
    };
    document.getElementById('typeEmail').value = "";

    try {
            const response = await axios.post('http://localhost:4000/password/forgotpassword', mailId); 
            alert(response.data.message);
            window.location.href = "../html/login.html";       
    }
    catch (err) {
        console.log(err);
    }
}

window.addEventListener('DOMContentLoaded', sendMail);