let quotes = [
  { text: "Push yourself, because no one else is going to do it for you.", category: "motivation" },
  { text: "Great things never come from comfort zones.", category: "motivation" },
  { text: "I told my computer I needed a break, and now it won’t stop sending me KitKats.", category: "humor" },
  { text: "Why don’t skeletons fight each other? They don’t have the guts.", category: "humor" }
];

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
  } else {
    quoteDisplay.textContent = "No quotes available for this category.";
  }
}

function addQuote() {
  let quoteInput = document.getElementById("newQuoteText").value.trim();
  let categoryInput = document.getElementById("newQuoteCategory").value.trim().toLowerCase();

  if (quoteInput && categoryInput) {
    quotes.push({ text: quoteInput, category: categoryInput });

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

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

populateCategories();
createAddQuoteForm();
showRandomQuote();
