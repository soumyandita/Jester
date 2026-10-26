const jokeText = document.getElementById("jokeText");
const jokeBtn = document.getElementById("jokeBtn");
const categorySelect = document.getElementById("categorySelect");
const favoriteBtn = document.getElementById("favoriteBtn");
const favoriteIcon = document.getElementById("favoriteIcon");
const copyBtn = document.getElementById("copyBtn");
const favoritesBtn = document.getElementById("favoritesBtn");
const favoritesPanel = document.getElementById("favoritesPanel");
const favoritesList = document.getElementById("favoritesList");
const favoritesCount = document.getElementById("favoritesCount");
const emptyFavorites = document.getElementById("emptyFavorites");
const message = document.getElementById("message");
const jokeTag = document.getElementById("jokeTag");
const jokeNumber = document.getElementById("jokeNumber");
const themeBtn = document.getElementById("themeBtn");
const themeIcon = document.getElementById("themeIcon");

const API_BASE = "https://v2.jokeapi.dev/joke/";
let currentJoke = null;
let jokeCounter = 0;
let favorites = readStorage("jester-favorites", []);
let requestController = null;

document.getElementById("year").textContent = new Date().getFullYear();

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    setMessage("Browser storage is unavailable, so this change may not be saved.", true);
  }
}

function setMessage(text, isError = false) {
  message.textContent = text;
  message.style.color = isError ? "#fb7185" : "";
}

function getJokeText(item) {
  return item.type === "single" ? item.joke : `${item.setup}\n\n${item.delivery}`;
}

async function getJoke() {
  if (requestController) requestController.abort();
  requestController = new AbortController();

  const category = categorySelect.value;
  jokeBtn.disabled = true;
  favoriteBtn.disabled = true;
  copyBtn.disabled = true;
  jokeBtn.querySelector("span:first-child").textContent = "Finding a laugh...";
  jokeText.textContent = "A fresh joke is on its way.";
  jokeTag.textContent = "LOADING SOMETHING FUN";
  setMessage("Connecting to the joke machine…");

  try {
    const response = await fetch(`${API_BASE}${encodeURIComponent(category)}?safe-mode`, {
      signal: requestController.signal,
      headers: { Accept: "application/json" }
    });

    if (!response.ok) throw new Error(`Request failed (${response.status})`);

    const data = await response.json();
    if (data.error) throw new Error("The joke service returned an error.");
    if (!["single", "twopart"].includes(data.type)) throw new Error("No joke was found.");

    currentJoke = {
      id: data.id ?? `${Date.now()}`,
      category: data.category || category,
      type: data.type,
      joke: data.joke,
      setup: data.setup,
      delivery: data.delivery
    };

    jokeCounter += 1;
    jokeNumber.textContent = `JOKE No. ${String(jokeCounter).padStart(3, "0")}`;
    jokeText.textContent = getJokeText(currentJoke);
    jokeTag.textContent = `${currentJoke.category.toUpperCase()} • SAFE MODE`;
    favoriteBtn.disabled = false;
    copyBtn.disabled = false;
    updateFavoriteButton();
    setMessage("Fresh joke delivered. Your turn to laugh!");
  } catch (error) {
    if (error.name === "AbortError") return;
    currentJoke = null;
    jokeText.textContent = "Oops! We couldn't fetch a joke right now.";
    jokeTag.textContent = "THE LAUGH MACHINE NEEDS A MOMENT";
    setMessage("Check your internet connection and try again.", true);
    favoriteBtn.disabled = true;
    copyBtn.disabled = true;
    updateFavoriteButton();
    console.error("Joke request failed:", error);
  } finally {
    jokeBtn.disabled = false;
    jokeBtn.querySelector("span:first-child").textContent = "Make me laugh";
    requestController = null;
  }
}

function isFavorite(item) {
  return Boolean(item) && favorites.some(saved => String(saved.id) === String(item.id));
}

function updateFavoriteButton() {
  const saved = isFavorite(currentJoke);
  favoriteBtn.classList.toggle("is-favorite", saved);
  favoriteBtn.setAttribute("aria-pressed", String(saved));
  favoriteIcon.textContent = saved ? "♥" : "♡";
  favoriteBtn.lastChild.textContent = saved ? " Saved" : " Save";
}

function toggleFavorite() {
  if (!currentJoke) return;
  if (isFavorite(currentJoke)) {
    favorites = favorites.filter(item => String(item.id) !== String(currentJoke.id));
    setMessage("Removed from your saved jokes.");
  } else {
    favorites.unshift(currentJoke);
    setMessage("Saved! This joke is in your favorites.");
  }
  writeStorage("jester-favorites", favorites);
  renderFavorites();
  updateFavoriteButton();
}

function renderFavorites() {
  favoritesCount.textContent = favorites.length;
  favoritesList.replaceChildren();
  emptyFavorites.hidden = favorites.length > 0;

  favorites.forEach(item => {
    const li = document.createElement("li");
    li.className = "favorite-item";
    const p = document.createElement("p");
    p.textContent = getJokeText(item);
    const remove = document.createElement("button");
    remove.className = "remove-favorite";
    remove.type = "button";
    remove.textContent = "×";
    remove.setAttribute("aria-label", "Remove saved joke");
    remove.addEventListener("click", () => {
      favorites = favorites.filter(saved => String(saved.id) !== String(item.id));
      writeStorage("jester-favorites", favorites);
      renderFavorites();
      updateFavoriteButton();
    });
    li.append(p, remove);
    favoritesList.append(li);
  });
}

async function copyJoke() {
  if (!currentJoke) return;
  try {
    await navigator.clipboard.writeText(getJokeText(currentJoke));
    setMessage("Joke copied to your clipboard!");
  } catch {
    setMessage("Clipboard access is unavailable in this browser.", true);
  }
}

function toggleTheme() {
  const isLight = document.body.classList.toggle("light-theme");
  themeIcon.textContent = isLight ? "☀" : "☾";
  themeBtn.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
  writeStorage("jester-theme", isLight ? "light" : "dark");
}

function applySavedTheme() {
  const theme = readStorage("jester-theme", "dark");
  const isLight = theme === "light";
  document.body.classList.toggle("light-theme", isLight);
  themeIcon.textContent = isLight ? "☀" : "☾";
  themeBtn.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
}

jokeBtn.addEventListener("click", getJoke);
favoriteBtn.addEventListener("click", toggleFavorite);
copyBtn.addEventListener("click", copyJoke);
themeBtn.addEventListener("click", toggleTheme);
favoritesBtn.addEventListener("click", () => {
  favoritesPanel.hidden = !favoritesPanel.hidden;
  if (!favoritesPanel.hidden) favoritesPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
});
document.getElementById("closeFavoritesBtn").addEventListener("click", () => {
  favoritesPanel.hidden = true;
});
categorySelect.addEventListener("change", getJoke);

applySavedTheme();
renderFavorites();
