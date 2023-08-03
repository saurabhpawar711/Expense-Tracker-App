document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn2 = document.querySelector(".navbar-toggler");
    const linksContainer2 = document.querySelector(".navbar-collapse");

    toggleBtn2.addEventListener("click", function () {
        linksContainer2.classList.toggle("show");
    });
});

const leaderBoard = document.getElementById('leaderboardLink');
leaderBoard.addEventListener('click', Leaderboardfunction);

async function Leaderboardfunction(event) {

    event.preventDefault();
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('http://localhost:4000/premium/show-leaderboard', { headers: { "Authentication": token } });
    
            for (let i = 0; i < response.data.userLeaderboardDetails.length, response.data.userLeaderboardDetails.length; i++) {
                showLeaderboard(response.data.userLeaderboardDetails[i], response.data.userPositionDetails[i]);
            }

        function showLeaderboard(leaderboard, position) {

            const tableBody = document.getElementById('leaderboardTableList');
            const newRow = document.createElement('tr');

            const positionCol = document.createElement('td');
            positionCol.classList.add('positionCol');
            positionCol.textContent = position.position;

            const nameCol = document.createElement('td');
            nameCol.classList.add('nameCol');
            nameCol.textContent = leaderboard.name;

            const amountCol = document.createElement('td');
            amountCol.classList.add('amountCol');
            if(leaderboard.totalAmount>0) {
                amountCol.textContent = leaderboard.totalAmount;
            }
            else {
                amountCol.textContent = 0;
            }

            newRow.appendChild(positionCol);
            newRow.appendChild(nameCol);
            newRow.appendChild(amountCol);
            tableBody.appendChild(newRow);
        }
    }
    catch (err) {
        console.log(err);
        const errorMessage = err.response.data.error;
        if(errorMessage) {
            window.location.href = '../html/index.html';
            alert(errorMessage);
        }
    }
}

window.addEventListener('DOMContentLoaded', Leaderboardfunction);
