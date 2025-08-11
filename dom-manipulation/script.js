// Quotes array (Step 2 format: array of objects)
let quotes = [
  { text: "Push yourself, because no one else is going to do it for you.", category: "motivation" },
  { text: "Great things never come from comfort zones.", category: "motivation" },
  { text: "I told my computer I needed a break, and now it won’t stop sending me KitKats.", category: "humor" },
  { text: "Why don’t skeletons fight each other? They don’t have the guts.", category: "humor" }
];

// Get DOM elements
const categorySelect = document.getElementById("categorySelect");
const quoteDisplay = document.getElementById("quoteDisplay");

// Populate categories in dropdown
function populateCategories() {
  categorySelect.innerHTML = "";
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    let option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

// Show random quote
function showRandomQuote() {
  let selectedCategory = categorySelect.value;
  let categoryQuotes = quotes.filter(q => q.category === selectedCategory);

  if (categoryQuotes.length > 0) {
    let randomQuote = categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
    quoteDisplay.textContent = randomQuote.text;
  } else {
    quoteDisplay.textContent = "No quotes available for this category.";
  }
}

// Add a new quote
function addQuote() {
  let quoteInput = document.getElementById("newQuoteText").value.trim();
  let categoryInput = document.getElementById("newQuoteCategory").value.trim().toLowerCase();

  if (quoteInput && categoryInput) {
    // Add new quote to array
    quotes.push({ text: quoteInput, category: categoryInput });

    // Refresh categories
    populateCategories();

    // Automatically select new category
    categorySelect.value = categoryInput;

    // Show the added quote immediately
    quoteDisplay.textContent = quoteInput;

    // Clear inputs
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// Event listener for showing a random quote
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Initialize
populateCategories();
showRandomQuote();
