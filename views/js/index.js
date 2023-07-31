document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.querySelector(".navbar-toggler");
    const linksContainer = document.querySelector(".navbar-collapse");

    toggleBtn.addEventListener("click", function () {
      linksContainer.classList.toggle("show");
    });
  });

  document.getElementById('rzp-btn').addEventListener("click", async function () {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/premium/buy-premium', { headers: { "Authentication": token } });

    var options = {
      "key": response.data.key_id,
      "order_id": response.data.order.id,
      "handler": async function (response) {
        try {
          await axios.post('http://localhost:3000/premium/update-status', {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
            status: "SUCCESSFUL"
          }, { headers: { "Authentication": token } })
          alert('You are premium user now');
          const premiumBtn = document.getElementById('rzp-btn');
          if (premiumBtn) {
            premiumBtn.remove();
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
      await axios.post('http://localhost:3000/premium/update-status', {
        order_id: options.order_id,
        status: "FAILED"
      }, { headers: { "Authentication": token } })
      alert('Something went wrong');
    })
  });

  // removePreBtn();
  async function removePreBtn() {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:3000/premium/premium-status', { headers: { "Authentication": token } });
      const isPremiumUser = response.data.premiumUser;
      const premiumBtn = document.getElementById('rzp-btn');
      if (!isPremiumUser) {
        premiumBtn.style.display = 'block';
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
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    let details = {
      date: formattedDate,
      amount: expenseAmount,
      description: expenseDescription,
      category: expenseCategory
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/expense/add-expenses', details, { headers: { "Authentication": token } });
      showExpense(response.data.expenseDetails);

    } catch (err) {
      console.log(err);
      document.body.innerHTML += '<h4>Something went wrong</h4>';
    }
  }

  window.addEventListener('DOMContentLoaded', async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:3000/expense/get-expenses', { headers: { "Authentication": token } });
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
          .delete(`http://localhost:3000/expense/delete-expenses/${id}`, { headers: { "Authentication": token } })
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