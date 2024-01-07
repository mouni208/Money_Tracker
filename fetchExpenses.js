// fetchExpenses.js

document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch('/expenses');
      const data = await response.json();
  
      if (response.ok) {
        const expensesList = document.getElementById('expensesList');
        expensesList.innerHTML = data.expenses.map(expense => `<li>${expense.type}: ${expense.amount}</li>`).join('');
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error(error);
    }
  });
  