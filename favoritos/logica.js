tailwind.config = {
    darkMode: "class",
    theme: {
      extend: {
        "colors": {
          "inverse-on-surface": "#f2f0f0",
          "secondary-fixed-dim": "#6dd8c8",
          "on-tertiary-fixed-variant": "#723600",
          "surface-container-highest": "#e4e2e2",
          "surface-dim": "#dbd9d9",
          "on-tertiary-container": "#ff8c31",
          "on-surface": "#1b1c1c",
          "outline-variant": "#c3c6cf",
          "on-tertiary-fixed": "#311300",
          "surface-container-low": "#f5f3f3",
          "secondary": "#006a60",
          "on-error": "#ffffff",
          "tertiary-fixed-dim": "#ffb786",
          "secondary-fixed": "#8bf5e4",
          "inverse-surface": "#303030",
          "on-primary-container": "#8cacd9",
          "on-secondary-fixed-variant": "#005048",
          "surface-container-lowest": "#ffffff",
          "surface-container": "#efeded",
          "on-secondary-fixed": "#00201c",
          "tertiary-fixed": "#ffdcc7",
          "inverse-primary": "#a8c9f7",
          "tertiary": "#451e00",
          "surface-variant": "#e4e2e2",
          "error": "#ba1a1a",
          "outline": "#73777f",
          "on-primary-fixed-variant": "#264870",
          "on-secondary": "#ffffff",
          "error-container": "#ffdad6",
          "on-error-container": "#93000a",
          "primary": "#002a4f",
          "surface": "#fbf9f8",
          "on-surface-variant": "#43474e",
          "primary-fixed-dim": "#a8c9f7",
          "on-background": "#1b1c1c",
          "on-tertiary": "#ffffff",
          "tertiary-container": "#663000",
          "surface-container-high": "#eae8e7",
          "secondary-container": "#88f2e2",
          "surface-bright": "#fbf9f8",
          "primary-container": "#1d4067",
          "primary-fixed": "#d3e4ff",
          "on-primary": "#ffffff",
          "on-primary-fixed": "#001c38",
          "on-secondary-container": "#006f64",
          "surface-tint": "#406089",
          "background": "#fbf9f8"
        },
        "borderRadius": {
          "DEFAULT": "0.25rem",
          "lg": "0.5rem",
          "xl": "0.75rem",
          "full": "9999px"
        },
        "spacing": {
          "space-lg": "1.5rem",
          "space-sm": "0.5rem",
          "gutter-sm": "1rem",
          "space-xl": "2.5rem",
          "margin": "2rem",
          "margin-sm": "1rem",
          "space-md": "1rem",
          "space-xs": "0.25rem",
          "gutter": "1.5rem"
        },
        "fontFamily": {
          "body-lg": ["Roboto Flex"],
          "label-lg": ["Roboto Flex"],
          "display-lg": ["Roboto Flex"],
          "headline-lg-mobile": ["Roboto Flex"],
          "display-lg-mobile": ["Roboto Flex"],
          "title-lg": ["Roboto Flex"],
          "headline-sm": ["Roboto Flex"],
          "label-md": ["Roboto Flex"],
          "title-md": ["Roboto Flex"],
          "label-sm": ["Roboto Flex"],
          "body-md": ["Roboto Flex"],
          "body-sm": ["Roboto Flex"],
          "headline-lg": ["Roboto Flex"],
          "headline-md": ["Roboto Flex"]
        },
        "fontSize": {
          "body-lg": ["16px", {"lineHeight": "24px", "letterSpacing": "0em", "fontWeight": "400"}],
          "label-lg": ["14px", {"lineHeight": "20px", "letterSpacing": "0.01em", "fontWeight": "600"}],
          "display-lg": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
          "headline-lg-mobile": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.005em", "fontWeight": "700"}],
          "display-lg-mobile": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "700"}],
          "title-lg": ["18px", {"lineHeight": "26px", "letterSpacing": "0em", "fontWeight": "600"}],
          "headline-sm": ["20px", {"lineHeight": "28px", "letterSpacing": "0em", "fontWeight": "600"}],
          "label-md": ["12px", {"lineHeight": "16px", "letterSpacing": "0.02em", "fontWeight": "600"}],
          "title-md": ["16px", {"lineHeight": "24px", "letterSpacing": "0.005em", "fontWeight": "500"}],
          "label-sm": ["10px", {"lineHeight": "14px", "letterSpacing": "0.04em", "fontWeight": "700"}],
          "body-md": ["14px", {"lineHeight": "20px", "letterSpacing": "0.01em", "fontWeight": "400"}],
          "body-sm": ["12px", {"lineHeight": "16px", "letterSpacing": "0.015em", "fontWeight": "400"}],
          "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "700"}],
          "headline-md": ["24px", {"lineHeight": "32px", "letterSpacing": "0em", "fontWeight": "600"}]
        }
      }
    }
  };

const KEY_FAVORITES = "planify:favoritos";
const KEY_LISTS = "planify:listasFavoritos";
const normalizeText = (value) => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
function readLocal(key, fallback) { try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; } catch (error) { console.error(error); return fallback; } }
function writeLocal(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (error) { alert("No se pudieron guardar los cambios en este navegador."); return false; } }
function cardIdFromName(name) { const [city, ...country] = String(name || "").split(",").map((part) => part.trim()); return `${normalizeText(country.join(","))}|${normalizeText(city)}`; }
let activeCategory = "all";
let activeQuery = "";
let activeList = null;
let sortMode = "recent";
let favorites = [];
let lists = [];
let cardsContainer;
let cardTemplates = [];
function favoriteDisplayName(item) { return item.ciudad && item.pais ? `${item.ciudad}, ${item.pais}` : item.destino || item.id; }
function setFavoriteButton(button, isFavorite) {
  const icon = button.querySelector(".material-symbols-outlined");
  if (!icon) return;
  icon.textContent = isFavorite ? "favorite" : "favorite_border";
  icon.style.fontVariationSettings = isFavorite ? "'FILL' 1" : "'FILL' 0";
  button.classList.toggle("text-on-tertiary-container", isFavorite);
  button.classList.toggle("text-on-surface-variant", !isFavorite);
}
function makeGenericCard(item) {
  const card = document.createElement("article"); card.className = "destination-card overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm";
  card.dataset.name = favoriteDisplayName(item); card.dataset.category = "ciudades"; card.dataset.popularity = "0"; card.dataset.date = item.guardadoEn || "";
  const visual = document.createElement("div"); visual.className = "flex h-40 items-end bg-primary-container p-5 text-white";
  const title = document.createElement("div"); title.append(Object.assign(document.createElement("p"), { className: "text-sm text-secondary-fixed", textContent: item.pais || "Destino guardado" }), Object.assign(document.createElement("h3"), { className: "text-xl font-bold", textContent: item.ciudad || item.destino || "Destino" })); visual.append(title);
  const actions = document.createElement("div"); actions.className = "flex flex-wrap gap-2 p-4";
  const heart = document.createElement("button"); heart.type = "button"; heart.className = "favorite-heart rounded-lg bg-surface-container px-3 py-2 text-error"; heart.setAttribute("aria-label", "Quitar de favoritos"); heart.innerHTML = '<span class="material-symbols-outlined">favorite</span>';
  const view = document.createElement("a"); view.className = "rounded-lg bg-surface-container px-3 py-2 text-sm font-semibold text-primary"; view.textContent = "Ver destino"; view.href = `../index.html?destino=${encodeURIComponent(item.destino || favoriteDisplayName(item))}`;
  const addList = document.createElement("button"); addList.type = "button"; addList.className = "rounded-lg bg-surface-container px-3 py-2 text-sm font-semibold text-primary"; addList.textContent = "Añadir a lista"; addList.addEventListener("click", () => addFavoriteToList(item.id));
  actions.append(heart, view, addList); card.append(visual, actions); return card;
}
function updateSummary() {
  const allTab = document.querySelector('[data-category="all"]'); if (allTab) allTab.textContent = `Todos (${favorites.length})`;
  const countries = new Set(favorites.map((item) => normalizeText(item.pais)).filter(Boolean));
  document.getElementById("favorite-total").textContent = String(favorites.length);
  document.getElementById("country-total").textContent = String(countries.size);
  document.getElementById("route-total").textContent = String(readLocal("planify:itinerarios", []).length);
  document.getElementById("list-count").textContent = `${lists.length} ${lists.length === 1 ? "activa" : "activas"}`;
  const japanSaved = favorites.some((item) => item.id === "japon|tokio" || item.id === "japon|kioto");
  document.getElementById("seasonal-suggestion").classList.toggle("hidden", !japanSaved);
}
function applyFilters() {
  let visibleCount = 0;
  cardsContainer.querySelectorAll(".destination-card").forEach((card) => {
    const item = favorites.find((favorite) => String(favorite.id) === card.dataset.favoriteId);
    const categoryMatches = activeCategory === "all" || (card.dataset.category || "").split(/\s+/).includes(activeCategory);
    const queryMatches = !activeQuery || normalizeText(card.dataset.name).includes(normalizeText(activeQuery));
    const listMatches = !activeList || lists.find((list) => list.id === activeList)?.destinos?.includes(card.dataset.favoriteId);
    const visible = Boolean(item && categoryMatches && queryMatches && listMatches);
    card.classList.toggle("hidden", !visible); if (visible) visibleCount++;
  });
  let empty = document.getElementById("favorites-empty");
  if (!empty) { empty = document.createElement("p"); empty.id = "favorites-empty"; empty.className = "hidden rounded-xl bg-white p-8 text-center text-on-surface-variant md:col-span-2"; cardsContainer.append(empty); }
  empty.textContent = favorites.length ? "No hay destinos que coincidan con estos filtros." : "";
  empty.classList.toggle("hidden", visibleCount > 0);
  if (!favorites.length) empty.textContent = "Aún no has guardado destinos favoritos. Usa el corazón en Explorar para añadir uno.";
}
function renderFavorites() {
  cardsContainer.replaceChildren();
  favorites.forEach((item) => {
    const displayName = favoriteDisplayName(item);
    const template = cardTemplates.find((card) => cardIdFromName(card.dataset.name) === item.id);
    const card = template ? template.cloneNode(true) : makeGenericCard(item);
    card.dataset.favoriteId = item.id; card.dataset.name = displayName; card.dataset.date = item.guardadoEn || card.dataset.date || "";
    const heart = card.querySelector(".favorite-heart");
    if (heart) { setFavoriteButton(heart, true); heart.setAttribute("aria-label", `Quitar ${displayName} de favoritos`); heart.addEventListener("click", () => removeFavorite(item.id)); }
    const buttons = card.querySelectorAll(".p-space-md.flex.flex-col.flex-1 button");
    if (buttons[0]) { buttons[0].addEventListener("click", () => { window.location.href = `../index.html?destino=${encodeURIComponent(item.destino || displayName)}`; }); }
    if (buttons[1]) { buttons[1].addEventListener("click", () => { window.location.href = "../itinerario/index.html"; }); }
    const actions = card.querySelector(".p-space-md.flex.flex-col.flex-1 > .flex.items-center.gap-space-sm.pt-space-xs");
    if (actions) { const addList = document.createElement("button"); addList.type = "button"; addList.className = "rounded-lg bg-surface-container px-3 py-2 text-xs font-semibold text-primary"; addList.textContent = "Añadir a lista"; addList.addEventListener("click", () => addFavoriteToList(item.id)); actions.append(addList); }
    cardsContainer.append(card);
  });
  sortCards(sortMode); renderLists(); updateSummary(); applyFilters();
}
function removeFavorite(id) { favorites = favorites.filter((item) => String(item.id) !== String(id)); if (writeLocal(KEY_FAVORITES, favorites)) renderFavorites(); }
function sortCards(mode) {
  sortMode = mode; const cards = Array.from(cardsContainer.querySelectorAll(".destination-card"));
  cards.sort((a, b) => mode === "alpha" ? a.dataset.name.localeCompare(b.dataset.name, "es") : mode === "popular" ? Number(b.dataset.popularity) - Number(a.dataset.popularity) : new Date(b.dataset.date) - new Date(a.dataset.date));
  cards.forEach((card) => cardsContainer.append(card));
}
function renderLists() {
  const container = document.getElementById("custom-lists-container"); if (!container) return; container.replaceChildren();
  lists.forEach((list) => {
    const button = document.createElement("button"); button.type = "button"; button.className = "flex w-full items-center justify-between rounded-xl bg-surface-container-low p-3 text-left hover:bg-surface-container";
    const detail = document.createElement("span"); detail.append(Object.assign(document.createElement("strong"), { className: "block text-primary", textContent: list.nombre }), Object.assign(document.createElement("span"), { className: "text-xs text-on-surface-variant", textContent: `${list.destinos.length} destinos` }));
    const actions = document.createElement("span"); actions.className = "flex items-center gap-2";
    const choose = document.createElement("span"); choose.textContent = "Ver"; choose.className = "text-xs font-semibold text-secondary";
    const remove = document.createElement("span"); remove.textContent = "Eliminar"; remove.className = "text-xs font-semibold text-error";
    button.append(detail, actions); actions.append(choose, remove);
    button.addEventListener("click", (event) => { if (event.target === remove) { lists = lists.filter((entry) => entry.id !== list.id); writeLocal(KEY_LISTS, lists); if (activeList === list.id) activeList = null; renderLists(); applyFilters(); } else { activeList = activeList === list.id ? null : list.id; applyFilters(); } });
    container.append(button);
  });
}
function addFavoriteToList(id) {
  if (!lists.length) { createList(id); return; }
  const options = lists.map((list, index) => `${index + 1}. ${list.nombre}`).join("\n"); const answer = prompt(`Escribe el número de la lista:\n${options}`); const index = Number(answer) - 1;
  if (!Number.isInteger(index) || !lists[index]) return;
  lists[index].destinos = Array.isArray(lists[index].destinos) ? lists[index].destinos : [];
  if (!lists[index].destinos.includes(id)) lists[index].destinos.push(id);
  writeLocal(KEY_LISTS, lists); renderLists(); alert(`Destino añadido a “${lists[index].nombre}”.`);
}
function createList(attachId = null) {
  const nombre = prompt("Nombre de la nueva lista:"); if (!nombre?.trim()) return;
  lists.push({ id: `list-${Date.now()}`, nombre: nombre.trim(), destinos: attachId ? [attachId] : [] });
  if (writeLocal(KEY_LISTS, lists)) { renderLists(); if (attachId) alert(`Lista “${nombre.trim()}” creada y destino añadido.`); }
}
document.addEventListener("DOMContentLoaded", () => {
  cardsContainer = document.getElementById("cards-container");
  cardTemplates = Array.from(cardsContainer.querySelectorAll(".destination-card"));
  favorites = readLocal(KEY_FAVORITES, []); if (!Array.isArray(favorites)) favorites = [];
  lists = readLocal(KEY_LISTS, []); if (!Array.isArray(lists)) lists = [];
  document.querySelectorAll(".filter-tab").forEach((tab) => tab.addEventListener("click", () => {
    document.querySelectorAll(".filter-tab").forEach((other) => { other.classList.remove("bg-secondary", "text-on-secondary"); other.classList.add("bg-surface-container-low", "text-on-surface-variant"); });
    tab.classList.add("bg-secondary", "text-on-secondary"); tab.classList.remove("bg-surface-container-low", "text-on-surface-variant"); activeCategory = tab.dataset.category; activeList = null; applyFilters();
  }));
  document.getElementById("search-input")?.addEventListener("input", (event) => { activeQuery = event.target.value; applyFilters(); });
  const sortButton = document.getElementById("sort-menu-btn"); const dropdown = document.getElementById("sort-dropdown");
  sortButton?.addEventListener("click", (event) => { event.stopPropagation(); dropdown.classList.toggle("hidden"); });
  document.addEventListener("click", () => dropdown?.classList.add("hidden"));
  document.querySelectorAll(".sort-option").forEach((option) => option.addEventListener("click", (event) => { event.stopPropagation(); const mode = option.dataset.sort; document.getElementById("current-sort-label").textContent = option.textContent; sortCards(mode); applyFilters(); dropdown.classList.add("hidden"); }));
  const createListButton = document.getElementById("create-list-btn"); createListButton?.addEventListener("click", createList);
  renderFavorites();
  window.addEventListener("storage", (event) => {
    if (event.key === KEY_FAVORITES) { favorites = readLocal(KEY_FAVORITES, []); renderFavorites(); }
    if (event.key === KEY_LISTS) { lists = readLocal(KEY_LISTS, []); renderLists(); }
    if (event.key === "planify:itinerarios") updateSummary();
  });
  window.addEventListener("pageshow", () => { favorites = readLocal(KEY_FAVORITES, []); lists = readLocal(KEY_LISTS, []); renderFavorites(); });
});
