export const exportToCSV = (transactions) => {
  if (!transactions.length) return alert("No data to export!");

  const headers = ["Date", "Category", "Type", "Amount"];
  const rows = transactions.map((t) => [
    new Date(t.date).toLocaleDateString(),
    t.category,
    t.type,
    t.amount,
  ]);

  let csvContent = "data:text/csv;charset=utf-8," 
    + [headers, ...rows].map((e) => e.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "transactions.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
