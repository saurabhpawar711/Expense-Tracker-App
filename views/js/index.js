

window.addEventListener("DOMContentLoaded", function () {
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
        const currentPage = parseInt(document.querySelector('.presentBtn').innerHTML);
        const lastPageBtn = document.querySelector('.lastBtn');
        const lastPage = parseInt(lastPageBtn.getAttribute('data-page'));
        const tableBody = document.getElementById('tableList');
        const expenseOnPage = tableBody.querySelectorAll('tr').length;
        const hasPreviousPage = currentPage > 1;

        const data = {
            currentPage: currentPage,
            hasPreviousPage: hasPreviousPage,
            nextPage: currentPage + 1,
            hasNextPage: true,
            previousPage: currentPage - 1,
            lastPage: lastPage + 1
        }

        if (expenseOnPage < 10) {
            showExpense(response.data.expenseDetails);
        }
        else {
            pagination(data);
            let nextPage = currentPage + 1;
            while (nextPage <= lastPage) {
                const nextPageTableBody = document.getElementById('tableList');
                const expensesOnNextPage = nextPageTableBody.querySelectorAll('tr').length;

                if (expensesOnNextPage < 10) {
                    showExpense(response.data.expenseDetails);
                    break;
                }
                nextPage++;
            }
        }
    } catch (err) {
        console.log(err);
    }
}

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
    deleteBtn.className = 'delbtn btn btn-outline-danger mx-2';
    deleteBtn.onclick = () => {
        deleteExpense(expense.id);
    }
    deleteEditCol.appendChild(deleteBtn);

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'editbtn btn btn-primary mx-2';
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


window.addEventListener('DOMContentLoaded', getExpenseDetails);
const itemsPerPage = document.getElementById('itemsPerPage');
itemsPerPage.addEventListener('change', getExpenseDetails);
async function getExpenseDetails() {

    const limit = itemsPerPage.value;
    console.log(limit);
    localStorage.setItem('limitPerPage', limit);
    const limitPerPage = localStorage.getItem('limitPerPage');
    const expensePerPage = {
        expensePerPage: limitPerPage
    }
    const page = 1;
    const token = localStorage.getItem('token');
    const response = await axios.post(`http://localhost:4000/expense/getDetails/${page}`, expensePerPage, { headers: { "Authorization": token } });
    clearExpenseList();
    for (let i = 0; i < response.data.expense.length; i++) {
        showExpense(response.data.expense[i]);
        pagination(response.data.data);
    }
    function clearExpenseList() {
        const expenseList = document.getElementById('tableList');
        expenseList.innerHTML = ''; 
    }
}

async function pagination(data) {

    const currentPage = data.currentPage;
    const hasPreviousPage = data.hasPreviousPage;
    const nextPage = data.nextPage;
    const hasNextPage = data.hasNextPage;
    const previousPage = data.previousPage;
    const lastPage = data.lastPage;
    const firstPage = 1;

    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const firstBtn = document.createElement('button');
    firstBtn.innerHTML = `<`;
    firstBtn.classList.add('firstBtn');
    pagination.appendChild(firstBtn);
    firstBtn.addEventListener('click', () => { goToPage(firstPage) });

    if (hasPreviousPage) {
        const previousBtn = document.createElement('button');
        previousBtn.innerHTML = `${previousPage}`;
        previousBtn.classList.add('previousBtn');
        pagination.appendChild(previousBtn);
        previousBtn.addEventListener('click', () => { goToPage(previousPage) });
    }

    const presentBtn = document.createElement('button');
    presentBtn.innerHTML = `${currentPage}`;
    presentBtn.classList.add('presentBtn', 'active');
    pagination.appendChild(presentBtn);
    presentBtn.addEventListener('click', () => { goToPage(currentPage) });

    if (hasNextPage) {
        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = `${nextPage}`;
        nextBtn.classList.add('nextBtn');
        pagination.appendChild(nextBtn)
        nextBtn.addEventListener('click', () => { goToPage(nextPage) });
    }

    const lastBtn = document.createElement('button');
    lastBtn.setAttribute(`data-page`, lastPage);
    lastBtn.innerHTML = `>`;
    lastBtn.classList.add('lastBtn');
    pagination.appendChild(lastBtn);
    lastBtn.addEventListener('click', () => { goToPage(lastPage) });
}
async function goToPage(page) {
    const tableBody = document.getElementById('tableList');
    tableBody.innerHTML = "";
    const token = localStorage.getItem('token');
    const limitPerPage = localStorage.getItem('limitPerPage');
    const expensePerPage = {
        expensePerPage: limitPerPage
    }
    const response = await axios.post(`http://localhost:4000/expense/getDetails/${page}`, expensePerPage, { headers: { "Authorization": token } });
    for (let i = 0; i < response.data.expense.length; i++) {
        showExpense(response.data.expense[i]);
        pagination(response.data.data);
    }
}

const logOutBtn = document.getElementById('logoutBtn');
logOutBtn.addEventListener('click', goToLogin);

function goToLogin(event) {
    event.preventDefault();
    localStorage.clear();
    window.location.href = '../html/login.html';
}