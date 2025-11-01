import React, { useState } from "react";

function AddTransaction({ addTransaction }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return alert("Please fill all fields");

    const newTransaction = {
      id: Date.now(),
      title,
      amount: parseFloat(amount),
      type,
      date: new Date().toLocaleDateString(),
    };
    addTransaction(newTransaction);
    setTitle("");
    setAmount("");
  };

  return (
    <form className="add-transaction" onSubmit={handleSubmit}>
      <h3>Add Transaction</h3>
      <input
        type="text"
        placeholder="Title (e.g. Salary, Rent)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <button type="submit">Add</button>
    </form>
  );
}

export default AddTransaction;
