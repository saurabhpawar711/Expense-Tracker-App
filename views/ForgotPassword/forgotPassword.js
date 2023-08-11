const backendApi = "http://16.170.212.225:4000";
const submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('click', sendMail);

async function sendMail(event) {

    event.preventDefault();
    const email = document.getElementById('typeEmail').value;

    const mailId = {
        email: email
    };
    document.getElementById('typeEmail').value = "";

    try {
        const response = await axios.post(`${backendApi}/password/forgotpassword`, mailId);
        alert(response.data.message);
        window.location.href = "../Login/login.html";
    }
    catch (err) {
        console.log(err);
    }
}
