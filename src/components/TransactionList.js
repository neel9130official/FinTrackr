import React from "react";

function TransactionList({ transactions, deleteTransaction }) {
  return (
    <div className="transaction-list">
      <h3>Transactions</h3>
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        transactions.map((t) => (
          <div
            key={t.id}
            className={`transaction-item ${t.type}`}
          >
            <span>
              {t.title} ({t.date})
            </span>
            <span>
              ₹{t.amount.toFixed(2)}{" "}
              <button className="delete-btn" onClick={() => deleteTransaction(t.id)}>
                ✕
              </button>
            </span>
          </div>
        ))
      )}
    </div>
  );
}

export default TransactionList;
