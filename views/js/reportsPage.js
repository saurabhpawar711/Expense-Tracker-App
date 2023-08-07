document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.querySelector(".navbar-toggler");
    const linksContainer = document.querySelector(".navbar-collapse");

    toggleBtn.addEventListener("click", function () {
        linksContainer.classList.toggle("show");
    });
});

const dailyButton = document.getElementById('dailyBtn');
const monthlyButton = document.getElementById('monthlyBtn');

dailyButton.addEventListener('click', dailyReports);
monthlyButton.addEventListener('click', monthlyReports);

async function dailyReports() {

    const tableBody = document.getElementById('dailyExpenseTable');
    tableBody.innerHTML = '';

    const date = document.getElementById('selectedDate').value;
    const dateSplit = date.split('-');
    const day = dateSplit[2];
    const month = dateSplit[1];
    const year = dateSplit[0];
    const formattedDate = `${day}/${month}/${year}`;
    const dateDetail = {
        date: formattedDate
    };
    try {
        let totalExpenseAmount = 0;
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:4000/reports/dailyReports', dateDetail, { headers: { "Authorization": token } });
        response.data.data.forEach((expense) => {
            showExpense(expense);
            totalExpenseAmount += expense.amount;
        })
        showTotalExpense(totalExpenseAmount);

        function showExpense(expense) {
            const tableBody2 = document.getElementById('dailyExpenseTable');
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


            newRow.appendChild(dateCol);
            newRow.appendChild(categoryCol);
            newRow.appendChild(descriptionCol);
            newRow.appendChild(amountCol);
            tableBody2.appendChild(newRow);
        }

        function showTotalExpense(amount) {
            const tableExpenseBody = document.getElementById('dailyExpenseTable');
            const totalRow = document.createElement('tr');

            const emptyCol = document.createElement('td');
            emptyCol.setAttribute('colspan', '2');

            const totalLabelCol = document.createElement('td');
            totalLabelCol.innerHTML = '<h6>Total</h6>';

            const totalAmountCol = document.createElement('td');
            totalAmountCol.innerHTML = `<h6>${amount}</h6>`;

            totalRow.appendChild(emptyCol);
            totalRow.appendChild(totalLabelCol);
            totalRow.appendChild(totalAmountCol);
            tableExpenseBody.appendChild(totalRow);
        }
    }
    catch (err) {
        console.log(err);
        const errorMessage = err.response.data.error;
        if (errorMessage) {
            window.location.href = '../html/index.html';
            alert(errorMessage);
        }
    }
}

async function monthlyReports() {

    const tableBody = document.getElementById('monthlyExpenseTable');
    tableBody.innerHTML = '';

    const month = document.getElementById('selectedMonth').value;
    console.log(month);
    const monthSplit = month.split('-');
    const monthNumber = monthSplit[1];

    const monthDetail = {
        month: monthNumber
    };

    try {
        let totalExpenseAmount = 0;
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:4000/reports/monthlyReports', monthDetail, { headers: { "Authorization": token } });
        console.log(response);
        response.data.data.forEach((expense) => {
            showExpense(expense);
            totalExpenseAmount += expense.amount;
        })
        showTotalExpense(totalExpenseAmount);

        function showExpense(expense) {
            const tableBody2 = document.getElementById('monthlyExpenseTable');
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


            newRow.appendChild(dateCol);
            newRow.appendChild(categoryCol);
            newRow.appendChild(descriptionCol);
            newRow.appendChild(amountCol);
            tableBody2.appendChild(newRow);
        }

        function showTotalExpense(amount) {
            const tableExpenseBody = document.getElementById('monthlyExpenseTable');
            const totalRow = document.createElement('tr');

            const emptyCol = document.createElement('td');
            emptyCol.setAttribute('colspan', '2');

            const totalLabelCol = document.createElement('td');
            totalLabelCol.innerHTML = '<h6>Total</h6>';

            const totalAmountCol = document.createElement('td');
            totalAmountCol.innerHTML = `<h6>${amount}</h6>`;

            totalRow.appendChild(emptyCol);
            totalRow.appendChild(totalLabelCol);
            totalRow.appendChild(totalAmountCol);
            tableExpenseBody.appendChild(totalRow);
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
