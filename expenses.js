
document.addEventListener('DOMContentLoaded', function () {
    const addExpensesForm = document.getElementById('addExpensesForm');

    addExpensesForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const expenseType = document.getElementById('expenseType').value;
        const expenseAmount = document.getElementById('expenseAmount').value;

        // Make an AJAX request to your server to add expenses
        fetch('/add-expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                expenseType,
                expenseAmount,
            }),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message); // Show a message or handle the response as needed
        })
        .catch(error => console.error('Error:', error));
    });
});
