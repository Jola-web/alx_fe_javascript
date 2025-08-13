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

// --- Populate category dropdown dynamically ---
function populateCategories() {
  const categorySelect = document.getElementById('categoryFilter');
  categorySelect.innerHTML = '<option value="all">All Categories</option>'; // reset

  // Get unique categories from quotes array
  const categories = [...new Set(quotes.map(q => q.category))];

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });

  // Restore last selected category from localStorage if available
  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory) {
    categorySelect.value = savedCategory;
    filterQuotes();
  }
}

// --- Filter quotes by selected category ---
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selectedCategory); // save choice

  let filteredQuotes = quotes;

  if (selectedCategory !== 'all') {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  displayFilteredQuotes(filteredQuotes);
}

// --- Helper: Display filtered quotes in DOM ---
function displayFilteredQuotes(filteredQuotes) {
  const quoteContainer = document.getElementById('quoteDisplay');
  quoteContainer.innerHTML = ''; // clear existing

  if (filteredQuotes.length === 0) {
    quoteContainer.textContent = 'No quotes found for this category.';
    return;
  }

  filteredQuotes.forEach(quote => {
    const p = document.createElement('p');
    p.textContent = `"${quote.text}" - (${quote.category})`;
    quoteContainer.appendChild(p);
  });
}

const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

// Fetch quotes from server and merge with local
async function syncWithServer() {
  try {
    const response = await fetch(SERVER_URL);
    let serverQuotes = await response.json();

    // Example: limit to first 10 for testing
    serverQuotes = serverQuotes.slice(0, 10).map(q => ({
      id: q.id,
      text: q.title,
      category: "Server Data"
    }));

    let localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

    let updated = false;

    // Merge server quotes into local storage (server wins on conflict)
    serverQuotes.forEach(serverQuote => {
      const localIndex = localQuotes.findIndex(lq => lq.id === serverQuote.id);
      if (localIndex > -1) {
        // Conflict: server takes precedence
        if (localQuotes[localIndex].text !== serverQuote.text) {
          localQuotes[localIndex] = serverQuote;
          updated = true;
        }
      } else {
        // New quote from server
        localQuotes.push(serverQuote);
        updated = true;
      }
    });

    if (updated) {
      localStorage.setItem('quotes', JSON.stringify(localQuotes));
      populateCategories();
      displayQuotes(localQuotes);
      alert('Quotes synced from server. Some updates were applied.');
    }
  } catch (error) {
    console.error('Error syncing with server:', error);
  }
}

// Simulate periodic sync every 60 seconds
setInterval(syncWithServer, 60000);

// Example: Sync on page load
syncWithServer();

// --- Update addQuote to refresh categories dynamically ---
async function addQuote() {
  const quoteText = document.getElementById('quoteText').value;
  const category = document.getElementById('quoteCategory').value;

  if (!quoteText || !category) {
    alert('Please enter both quote and category');
    return;
  }

  const newQuote = {
    id: Date.now(),
    text: quoteText,
    category: category
  };

  // Save locally
  let quotes = JSON.parse(localStorage.getItem('quotes')) || [];
  quotes.push(newQuote);
  localStorage.setItem('quotes', JSON.stringify(quotes));

  populateCategories();
  displayQuotes(quotes);

  // Simulate POST to server
  try {
    await fetch(SERVER_URL, {
      method: 'POST',
      body: JSON.stringify(newQuote),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    console.log('Quote sent to server:', newQuote);
  } catch (error) {
    console.error('Error sending quote to server:', error);
  }
}

// Call this when page loads to set up dropdown
window.onload = function() {
  populateCategories();
};
