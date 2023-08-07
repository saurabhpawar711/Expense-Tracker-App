
document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.querySelector(".navbar-toggler");
    const linksContainer = document.querySelector(".navbar-collapse");

    toggleBtn.addEventListener("click", function () {
        linksContainer.classList.toggle("show");
    });
});

document.getElementById('downloadFile').addEventListener('click', downloadExpenseFile);

async function downloadExpenseFile() {
    try {
        const token = localStorage.getItem('token');
        const downloadRes = await axios.get('http://localhost:4000/user/download', { headers: { "Authorization": token } });
        if (downloadRes.status === 200) {
            const a = document.createElement('a');
            a.href = downloadRes.data.fileUrl;
            a.download = 'myexpense.csv'
            a.click();
        }
        else {
            throw new Error('Something went wrong');
        }
    }
    catch (err) {
        console.log(err);
        const errorMessage = err.response.data.error;
        if (errorMessage) {
            alert(errorMessage);
        }
    }
}

document.getElementById('rzp-btn').addEventListener("click", async function () {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:4000/premium/buy-premium', { headers: { "Authorization": token } });

    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            try {
                await axios.post('http://localhost:4000/premium/update-status', {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id,
                    status: "SUCCESSFUL"
                }, { headers: { "Authorization": token } })
                alert('You are premium user now');
                const premiumBtn = document.getElementById('rzp-btn');
                const premiumUser = document.getElementById('premiumMember');
                if (premiumBtn) {
                    premiumBtn.style.display = 'none';
                    premiumUser.style.display = 'block';
                }
            }
            catch (err) {
                console.log(err);
            }
        }
    }

    const rzp1 = new Razorpay(options);
    console.log(rzp1);
    rzp1.open();


    rzp1.on('payment.failed', async function (response) {
        console.log(response);
        await axios.post('http://localhost:4000/premium/update-status', {
            order_id: options.order_id,
            status: "FAILED"
        }, { headers: { "Authorization": token } })
        alert('Something went wrong');
    })
});

async function removePreBtn() {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('http://localhost:4000/premium/premium-status', { headers: { "Authorization": token } });
        const isPremiumUser = response.data.premiumUser;
        const premiumBtn = document.getElementById('rzp-btn');
        const premiumUser = document.getElementById('premiumMember');
        if (isPremiumUser) {
            premiumBtn.style.display = 'none';
            premiumUser.style.display = 'block';
        } else {
            premiumBtn.style.display = 'block';
            premiumUser.style.display = 'none';
        }
    }
    catch (err) {
        console.log(err);
    }
}

document.addEventListener('DOMContentLoaded', removePreBtn);

async function addExpense(event) {
    event.preventDefault();

    const expenseAmount = document.getElementById('amount').value;
    const expenseDescription = document.getElementById('description').value;
    const expenseCategory = document.getElementById('category').value;

    document.getElementById('amount').value = "";
    document.getElementById('description').value = "";
    document.getElementById('category').value = "";

    const date = new Date();

    const formattedDate = date.toLocaleDateString('en-GB');

    let details = {
        date: formattedDate,
        amount: expenseAmount,
        description: expenseDescription,
        category: expenseCategory
    };

    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:4000/expense/add-expenses', details, { headers: { "Authorization": token } });
        showExpense(response.data.expenseDetails);

    } catch (err) {
        console.log(err);
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:4000/expense/get-expenses', { headers: { "Authorization": token } });
        for (let i = 0; i < response.data.gotDetails.length; i++) {
            showExpense(response.data.gotDetails[i]);
        }
    } catch (err) {
        console.log(err);
    }
});

function showExpense(expense) {
    const tableBody = document.getElementById('tableList');
    const newRow = document.createElement('tr');

    const dateCol = document.createElement('td');
    dateCol.classList.add('dateCol');
    dateCol.textContent = expense.date;

    const categoryCol = document.createElement('td');
    categoryCol.classList.add('categoryCol');
    categoryCol.textContent = expense.category;

    const amountCol = document.createElement('td');
    amountCol.classList.add('amountCol');
    amountCol.textContent = expense.amount;

    const descriptionCol = document.createElement('td');
    descriptionCol.classList.add('descriptionCol');
    descriptionCol.textContent = expense.description;

    const deleteEditCol = document.createElement('td');
    deleteEditCol.classList.add('deleteEditCol');
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delbtn mx-2';
    deleteBtn.onclick = () => {
        deleteExpense(expense.id);
    }
    deleteEditCol.appendChild(deleteBtn);

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'editbtn bg-primary mx-2';
    editBtn.onclick = () => {
        deleteExpense(expense.id);
        document.getElementById('amount').value = expense.amount;
        document.getElementById('description').value = expense.description;
        document.getElementById('category').value = expense.category;
    }
    deleteEditCol.appendChild(editBtn);

    async function deleteExpense(id) {
        try {
            const token = localStorage.getItem('token');
            const delExpense = await axios
                .delete(`http://localhost:4000/expense/delete-expenses/${id}`, { headers: { "Authorization": token } })
            removeExpenseFromScreen(delExpense);
        }
        catch (err) {
            console.log(err);
        }
    }

    function removeExpenseFromScreen(expense) {
        newRow.removeChild(dateCol);
        newRow.removeChild(categoryCol);
        newRow.removeChild(amountCol);
        newRow.removeChild(descriptionCol);
        newRow.removeChild(deleteEditCol);
        tableBody.removeChild(newRow);
    }

    newRow.appendChild(dateCol);
    newRow.appendChild(categoryCol);
    newRow.appendChild(amountCol);
    newRow.appendChild(descriptionCol);
    newRow.appendChild(deleteEditCol);
    tableBody.appendChild(newRow);
}

const leaderBoard = document.getElementById('leaderboardLink');
const reports = document.getElementById('reportsLink');
leaderBoard.addEventListener('click', checkPremiumforLeaderboard);
reports.addEventListener('click', checkPremiumforReports);

async function checkPremiumforLeaderboard() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/premium/check-premium', { headers: { "Authorization": token } });

        if (response.data.isPremium === true) {
            window.location.href = '../html/leaderboard.html';
        } else {
            alert('Premium membership required');
        }
    } catch (err) {
        const errorMessage = err.response.data.error;
        if (errorMessage) {
            alert(errorMessage);
            window.location.href = '../html/index.html';
        }
    }
}
async function checkPremiumforReports() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/premium/check-premium', { headers: { "Authorization": token } });

        if (response.data.isPremium === true) {
            window.location.href = '../html/reportsPage.html';
        } else {
            alert('Premium membership required');
        }
    } catch (err) {
        const errorMessage = err.response.data.error;
        if (errorMessage) {
            alert(errorMessage);
            window.location.href = '../html/index.html';
        }
    }
}