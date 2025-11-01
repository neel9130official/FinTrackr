import React from "react";

function Summary({ transactions }) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);
  const balance = income - expense;

  return (
    <div className="summary-container">
      <h3>Summary</h3>
      <p><strong>Total Income:</strong> ₹{income.toFixed(2)}</p>
      <p><strong>Total Expense:</strong> ₹{expense.toFixed(2)}</p>
      <p><strong>Balance:</strong> ₹{balance.toFixed(2)}</p>
    </div>
  );
}

export default Summary;
