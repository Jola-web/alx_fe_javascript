// ======== Dynamic Quote Generator with Local Storage + Server Sync ========

// ------------------ Data Setup ------------------
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The best way to predict the future is to invent it.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

let categories = JSON.parse(localStorage.getItem("categories")) || ["Motivation", "Life"];
const serverURL = "https://jsonplaceholder.typicode.com/posts";

// ------------------ DOM Elements ------------------
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const newQuoteInput = document.getElementById("newQuote");
const newCategoryInput = document.getElementById("newCategory");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const notificationBox = document.getElementById("notification");

// ------------------ Utility Functions ------------------
function saveToLocalStorage() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
    localStorage.setItem("categories", JSON.stringify(categories));
}

function populateCategories() {
    categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });
}

function displayQuotes(filteredQuotes = quotes) {
    if (filteredQuotes.length === 0) {
        quoteDisplay.textContent = "No quotes available.";
        return;
    }
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    quoteDisplay.textContent = `"${filteredQuotes[randomIndex].text}" - ${filteredQuotes[randomIndex].category}`;
}

function showNotification(message) {
    notificationBox.textContent = message;
    notificationBox.style.display = "block";
    setTimeout(() => notificationBox.style.display = "none", 3000);
}

// ------------------ Core Actions ------------------
function addQuote() {
    const text = newQuoteInput.value.trim();
    const category = newCategoryInput.value.trim();

    if (!text || !category) {
        alert("Please enter both quote and category.");
        return;
    }

    if (!categories.includes(category)) {
        categories.push(category);
        populateCategories();
    }

    quotes.push({ text, category });
    saveToLocalStorage();
    displayQuotes();

    newQuoteInput.value = "";
    newCategoryInput.value = "";
}

// ------------------ Filtering ------------------
categoryFilter.addEventListener("change", () => {
    const selected = categoryFilter.value;
    if (selected === "all") {
        displayQuotes(quotes);
    } else {
        displayQuotes(quotes.filter(q => q.category === selected));
    }
});

// ------------------ Server Sync ------------------
async function syncWithServer() {
    try {
        // Simulate fetching quotes from server
        const res = await fetch(serverURL);
        const serverData = await res.json();

        // Convert server data to same format (using 'title' as quote text)
        const serverQuotes = serverData.slice(0, 5).map(item => ({
            text: item.title,
            category: "Server"
        }));

        // Conflict resolution: Server wins
        quotes = [...serverQuotes, ...quotes];
        saveToLocalStorage();
        populateCategories();
        displayQuotes();

        showNotification("Quotes synced with server!");
    } catch (error) {
        console.error("Error syncing with server:", error);
    }
}

// Periodic Sync (every 20 seconds)
setInterval(syncWithServer, 20000);

// ------------------ Init ------------------
addQuoteBtn.addEventListener("click", addQuote);
populateCategories();
displayQuotes();
