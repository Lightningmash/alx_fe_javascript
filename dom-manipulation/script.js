let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
];

function showRandomQuote() {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById("quoteDisplay").innerText = `"${quote.text}" - ${quote.category}`;
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value;
  const category = document.getElementById("newQuoteCategory").value;
  if (text && category) {
    quotes.push({ text, category });
    document.getElementById("newQuoteText").value = '';
    document.getElementById("newQuoteCategory").value = '';
    alert("Quote added!");
  }
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
