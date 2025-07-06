let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

// === Core Functions ===
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// === Quote Display ===
function displayQuotes(filteredQuotes = quotes) {
  const display = document.getElementById("quoteDisplay");
  display.innerHTML = filteredQuotes.map(q => `<p>"${q.text}" - ${q.category}</p>`).join('');
}

// === Random Quote ===
function showRandomQuote() {
  const category = document.getElementById("categoryFilter").value;
  const filtered = category === "all" ? quotes : quotes.filter(q => q.category === category);
  if (filtered.length === 0) return;
  const quote = filtered[Math.floor(Math.random() * filtered.length)];
  document.getElementById("quoteDisplay").innerHTML = `<p>"${quote.text}" - ${quote.category}</p>`;
}

// === Add New Quote ===
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !category) return alert("Please enter both quote and category.");

  quotes.push({ text, category });
  saveQuotes();
  document.getElementById("newQuoteText").value = '';
  document.getElementById("newQuoteCategory").value = '';
  populateCategories();
  filterQuotes();
  alert("Quote added!");
}

// === Category Dropdown ===
function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];
  filter.innerHTML = `<option value="all">All Categories</option>` +
    categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
  const saved = localStorage.getItem("lastFilter") || "all";
  filter.value = saved;
}

// === Filtering ===
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastFilter", selected);
  const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);
  displayQuotes(filtered);
}

// === Export to JSON ===
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

// === Import from JSON ===
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON file.");
      }
    } catch {
      alert("Error reading JSON.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

// === Server Sync Simulation ===
async function fetchFromServer() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=3");
    const data = await res.json();
    const serverQuotes = data.map(q => ({ text: q.title, category: "Server" }));

    // Simulate conflict resolution: overwrite quotes with same text
    serverQuotes.forEach(serverQuote => {
      if (!quotes.some(q => q.text === serverQuote.text)) {
        quotes.push(serverQuote);
      }
    });

    saveQuotes();
    populateCategories();
    filterQuotes();
    alert("Synced with server.");
  } catch (error) {
    console.error("Failed to sync with server:", error);
  }
}

// === Initial Load ===
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  filterQuotes();
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  setInterval(fetchFromServer, 30000); // Sync every 30 seconds
});
