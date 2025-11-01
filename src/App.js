import React, { useState, useEffect } from "react";
import "./App.css";
import {
  Chart,
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import { exportToCSV } from "./utils/exportCSV";

Chart.register(
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

function App() {
  const savedTheme = localStorage.getItem("mm_theme") || "dark";
  const [theme, setTheme] = useState(savedTheme);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [customCategory, setCustomCategory] = useState("");
  const [type, setType] = useState("Expense");
  const [month, setMonth] = useState("All");
  const [date, setDate] = useState("");

  const categories = [
    "Food",
    "Rent",
    "Travel",
    "Bills",
    "Shopping",
    "Salary",
    "Other",
  ];

  // 🎨 Chart colors
  const COLORS = [
    "#FF6B6B", // red
    "#6BCB77", // green
    "#FFD93D", // yellow
    "#4D96FF", // blue
    "#B983FF", // purple
    "#FF8C00", // orange
    "#00BFFF", // sky blue
    "#E96479", // pink
    "#845EC2", // violet
    "#0081CF", // navy
  ];

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("mm_theme", theme);
  }, [theme]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("mm_transactions") || "[]");
    if (saved.length) {
      setTransactions(saved);
    } else {
      // 💰 Demo data
      const demoData = [
        { id: 1, amount: 75000, category: "Salary", type: "Income", date: "2025-10-25" },
        { id: 2, amount: 15000, category: "Rent", type: "Expense", date: "2025-10-26" },
        { id: 3, amount: 1250, category: "Food", type: "Expense", date: "2025-10-27" },
        { id: 4, amount: 600, category: "Travel", type: "Expense", date: "2025-10-28" },
        { id: 5, amount: 2800, category: "Shopping", type: "Expense", date: "2025-10-29" },
        { id: 6, amount: 2200, category: "Bills", type: "Expense", date: "2025-10-30" },
        { id: 7, amount: 12000, category: "Freelancing", type: "Income", date: "2025-10-31" },
        { id: 8, amount: 5000, category: "Investment", type: "Expense", date: "2025-11-01" },
        { id: 9, amount: 750, category: "Food", type: "Expense", date: "2025-11-02" },
        { id: 10, amount: 10000, category: "Salary Bonus", type: "Income", date: "2025-11-03" },
      ];
      setTransactions(demoData);
      localStorage.setItem("mm_transactions", JSON.stringify(demoData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mm_transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) return alert("Enter a valid amount!");
    const newTransaction = {
      id: Date.now(),
      amount: parseFloat(amount),
      category: category === "Other" ? customCategory || "Misc" : category,
      type,
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
    };
    setTransactions([newTransaction, ...transactions]);
    setAmount("");
    setCustomCategory("");
    setDate("");
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const filteredTransactions =
    month === "All"
      ? transactions
      : transactions.filter(
          (t) => new Date(t.date).getMonth() + 1 === parseInt(month)
        );

  const income = filteredTransactions
    .filter((t) => t.type === "Income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = filteredTransactions
    .filter((t) => t.type === "Expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expense;

  // Chart data setup
  const categoryTotals = categories.map((cat) =>
    filteredTransactions
      .filter((t) => t.category === cat && t.type === "Expense")
      .reduce((acc, t) => acc + t.amount, 0)
  );

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: "Expenses by Category",
        data: categoryTotals,
        backgroundColor: COLORS,
        borderColor: "#ffffff",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, labels: { color: theme === "dark" ? "#fff" : "#000" } },
    },
    scales: {
      x: { ticks: { color: theme === "dark" ? "#fff" : "#000" } },
      y: { ticks: { color: theme === "dark" ? "#fff" : "#000" } },
    },
    animation: {
      duration: 1500,
      easing: "easeInOutQuart",
    },
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        <h1>💠 FinTrackr</h1>
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
      <p className="tagline">Smart. Secure. Scientific Finance Tracker.</p>

      {/* Summary Cards */}
      <div className="summary-container">
        <p>
          Income: <span className="positive">₹{income.toFixed(2)}</span>
        </p>
        <p>
          Expense: <span className="negative">₹{expense.toFixed(2)}</span>
        </p>
        <p>
          Balance:{" "}
          <span className={balance >= 0 ? "positive" : "negative"}>
            ₹{balance.toFixed(2)}
          </span>
        </p>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <label>Select Month: </label>
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="All">All</option>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
        <button onClick={() => exportToCSV(filteredTransactions)}>⬇️ Export CSV</button>
      </div>

      {/* Add Transaction */}
      <div className="add-transaction">
        <h3>Add Transaction</h3>
        <form onSubmit={addTransaction}>
          <div className="form-row">
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {category === "Other" && (
              <input
                type="text"
                placeholder="Enter category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                required
              />
            )}
            <select value={type} onChange={(e) => setType(e.target.value)} required>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <button type="submit">Add</button>
          </div>
        </form>
      </div>

      {/* Charts */}
      <div className="charts-wrapper">
        <div className="chart-box">
          <h3>Bar Chart</h3>
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="chart-box">
          <h3>Line Chart</h3>
          <Line data={chartData} options={chartOptions} />
        </div>
        <div className="chart-box">
          <h3>Pie Chart</h3>
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Transactions */}
      <div className="transaction-list">
        <h3>Transaction History</h3>
        {filteredTransactions.length === 0 ? (
          <p>No transactions found</p>
        ) : (
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount (₹)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t) => (
                <tr key={t.id} className={t.type === "Income" ? "row-income" : "row-expense"}>
                  <td>{new Date(t.date).toLocaleDateString()}</td>
                  <td>{t.category}</td>
                  <td>{t.type}</td>
                  <td>{t.amount.toFixed(2)}</td>
                  <td>
                    <button className="delete-btn" onClick={() => deleteTransaction(t.id)}>
                      ✖
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
