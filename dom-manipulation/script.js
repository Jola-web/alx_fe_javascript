let quotes = [];

// Load quotes from localStorage if available
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    // Default quotes if localStorage is empty
    quotes = [
      { text: "Push yourself, because no one else is going to do it for you.", category: "motivation" },
      { text: "Great things never come from comfort zones.", category: "motivation" },
      { text: "I told my computer I needed a break, and now it won’t stop sending me KitKats.", category: "humor" },
      { text: "Why don’t skeletons fight each other? They don’t have the guts.", category: "humor" }
    ];
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

const categorySelect = document.getElementById("categorySelect");
const quoteDisplay = document.getElementById("quoteDisplay");

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

function showRandomQuote() {
  let selectedCategory = categorySelect.value;
  let categoryQuotes = quotes.filter(q => q.category === selectedCategory);

  if (categoryQuotes.length > 0) {
    let randomQuote = categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
    quoteDisplay.textContent = randomQuote.text;

    // Save last viewed quote to sessionStorage
    sessionStorage.setItem("lastQuote", randomQuote.text);
  } else {
    quoteDisplay.textContent = "No quotes available for this category.";
  }
}

function addQuote() {
  let quoteInput = document.getElementById("newQuoteText").value.trim();
  let categoryInput = document.getElementById("newQuoteCategory").value.trim().toLowerCase();

  if (quoteInput && categoryInput) {
    quotes.push({ text: quoteInput, category: categoryInput });

    saveQuotes(); // Save updated quotes array to localStorage

    populateCategories();
    categorySelect.value = categoryInput;
    quoteDisplay.textContent = quoteInput;

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  } else {
    alert("Please enter both a quote and a category.");
  }
}

function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  const formTitle = document.createElement("h2");
  formTitle.textContent = "Add a New Quote";

  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(formTitle);
  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}

// Initialize
loadQuotes();
populateCategories();
createAddQuoteForm();

// Restore last viewed quote from sessionStorage
const lastQuote = sessionStorage.getItem("lastQuote");
if (lastQuote) {
  quoteDisplay.textContent = lastQuote;
} else {
  showRandomQuote();
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Export quotes as a JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format. Expected an array of quotes.");
      }
    } catch (error) {
      alert("Error parsing JSON: " + error.message);
    }
  };

  fileReader.readAsText(event.target.files[0]);
}
