const KEY_FAVORITES = "favoritos";
const KEY_LISTS = "listas-favoritos";
const KEY_RATINGS = "calificaciones";
const KEY_WEATHER_CACHE = "clima-favoritos";
const KEY_PHOTOS = "fotos";
const KEY_TRIPS = "itinerarios";
function migrateLegacyStorageKey(newKey, legacyKey) {
  const currentValue = localStorage.getItem(newKey);
  const legacyValue = localStorage.getItem(legacyKey);
  if (currentValue === null && legacyValue !== null) localStorage.setItem(newKey, legacyValue);
  if (legacyValue !== null) localStorage.removeItem(legacyKey);
}
migrateLegacyStorageKey(KEY_FAVORITES, "planify:favoritos");
migrateLegacyStorageKey(KEY_LISTS, "planify:listasFavoritos");
migrateLegacyStorageKey(KEY_RATINGS, "planify:calificaciones");
migrateLegacyStorageKey(KEY_WEATHER_CACHE, "planify:clima-favoritos");
migrateLegacyStorageKey(KEY_PHOTOS, "planify:fotos");
migrateLegacyStorageKey(KEY_TRIPS, "planify:itinerarios");
const normalizeText = (value) => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
function readLocal(key, fallback) { try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; } catch (error) { console.error(error); return fallback; } }
function writeLocal(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (error) { alert("No se pudieron guardar los cambios en este navegador."); return false; } }
function cardIdFromName(name) { const [city, ...country] = String(name || "").split(",").map((part) => part.trim()); return `${normalizeText(country.join(","))}|${normalizeText(city)}`; }
let activeQuery = "";
let activeList = null;
let sortMode = "recent";
let favorites = [];
let lists = [];
let cardsContainer;
let cardTemplates = [];
function favoriteDisplayName(item) { return item.ciudad && item.pais ? `${item.ciudad}, ${item.pais}` : item.destino || item.id; }
function cityFavorites() { return favorites.filter((item) => String(item.ciudad || "").trim()); }
function setFavoriteButton(button, isFavorite) {
  const icon = button.querySelector(".material-symbols-outlined");
  if (!icon) return;
  icon.textContent = isFavorite ? "favorite" : "favorite_border";
  icon.style.fontVariationSettings = isFavorite ? "'FILL' 1" : "'FILL' 0";
  button.classList.toggle("text-on-tertiary-container", isFavorite);
  button.classList.toggle("text-on-surface-variant", !isFavorite);
}
function savedPhoto(item) {
  if (item.imagen) return item.imagen;
  const photos = readLocal(KEY_PHOTOS, {});
  const city = normalizeText(item.ciudad || "");
  const country = normalizeText(item.pais || "");
  return photos[`es:${city}`]?.thumb || photos[`en:${city}`]?.thumb || photos[`es:${country}`]?.thumb || "";
}
function savedCurrency(item) {
  if (item.moneda) return item.moneda;
  const currencies = {
    alemania: "EUR", australia: "AUD", brasil: "BRL", canada: "CAD", colombia: "COP",
    "corea del sur": "KRW", espana: "EUR", "estados unidos": "USD", francia: "EUR",
    italia: "EUR", japon: "JPY", mexico: "MXN", "paises bajos": "EUR", portugal: "EUR",
    "reino unido": "GBP", suiza: "CHF"
  };
  return currencies[normalizeText(item.pais || "")] || "—";
}
function ratings() { return readLocal(KEY_RATINGS, {}); }
function paintRating(button, score) {
  const label = button.querySelector(".rating-label");
  const icon = button.querySelector(".rating-icon");
  label.textContent = score ? `${score}/5` : "—";
  icon.style.color = score ? "#ffb786" : "#ffdcc7";
  button.setAttribute("aria-label", score ? `Tu puntuación: ${score} de 5. Cambiar puntuación` : "Puntuar este destino");
}
function openRatingPicker(button, item) {
  document.querySelectorAll(".rating-picker").forEach((picker) => picker.remove());
  const picker = document.createElement("div");
  picker.className = "rating-picker absolute right-0 bottom-full mb-2 z-20 rounded-lg bg-white p-2 shadow-xl flex items-center gap-1";
  picker.setAttribute("role", "group"); picker.setAttribute("aria-label", `Puntuar ${favoriteDisplayName(item)}`);
  const current = Number(ratings()[item.id] || 0);
  for (let score = 1; score <= 5; score++) {
    const star = document.createElement("button"); star.type = "button"; star.className = "rating-choice p-1 text-xl text-orange-400 hover:scale-110 transition-transform";
    star.setAttribute("aria-label", `${score} de 5`); star.textContent = "★";
    if (score > current) star.classList.add("opacity-40");
    star.addEventListener("click", (event) => {
      event.stopPropagation(); const values = ratings(); values[item.id] = score;
      if (writeLocal(KEY_RATINGS, values)) { paintRating(button, score); picker.remove(); }
    }); picker.append(star);
  }
  button.parentElement.append(picker);
  const close = (event) => { if (!picker.contains(event.target) && !button.contains(event.target)) { picker.remove(); document.removeEventListener("click", close); } };
  setTimeout(() => document.addEventListener("click", close), 0);
}
const WEATHER_CODES = new Map([[0,"Despejado"],[1,"Mayormente despejado"],[2,"Parcialmente nublado"],[3,"Nublado"],[45,"Niebla"],[48,"Niebla"],[51,"Llovizna"],[53,"Llovizna"],[55,"Llovizna"],[61,"Lluvia"],[63,"Lluvia"],[65,"Lluvia fuerte"],[71,"Nevada"],[73,"Nevada"],[75,"Nevada"],[80,"Chubascos"],[81,"Chubascos"],[82,"Chubascos"],[95,"Tormenta"]]);
const WEATHER_ICONS = new Map([[0,"sunny"],[1,"sunny"],[2,"partly_cloudy_day"],[3,"cloud"],[45,"foggy"],[48,"foggy"],[51,"rainy"],[53,"rainy"],[55,"rainy"],[61,"rainy"],[63,"rainy"],[65,"rainy"],[71,"weather_snowy"],[73,"weather_snowy"],[75,"weather_snowy"],[80,"rainy"],[81,"rainy"],[82,"rainy"],[95,"thunderstorm"]]);
async function loadCardWeather(item, badge) {
  const key = `${normalizeText(item.ciudad)},${normalizeText(item.pais)}`;
  const cache = readLocal(KEY_WEATHER_CACHE, {});
  if (cache[key] && Date.now() - cache[key].savedAt < 30 * 60 * 1000) { showCardWeather(badge, cache[key]); return; }
  try {
    const query = encodeURIComponent(`${item.ciudad}, ${item.pais}`);
    const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(item.ciudad)}&count=10&language=es&format=json`);
    if (!geoResponse.ok) throw new Error("Geocodificación no disponible");
    const geo = await geoResponse.json();
    const place = geo.results?.find((result) => normalizeText(result.name) === normalizeText(item.ciudad) && normalizeText(result.country) === normalizeText(item.pais)) || geo.results?.find((result) => normalizeText(result.name) === normalizeText(item.ciudad));
    if (!place) throw new Error("No se encontró el destino");
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,weather_code&timezone=auto`);
    if (!response.ok) throw new Error("Clima no disponible");
    const data = await response.json(); const code = data.current.weather_code;
    const result = { temperature: Math.round(data.current.temperature_2m), description: WEATHER_CODES.get(code) || "Clima actual", icon: WEATHER_ICONS.get(code) || "cloud", savedAt: Date.now() };
    cache[key] = result; writeLocal(KEY_WEATHER_CACHE, cache); showCardWeather(badge, result);
  } catch (error) {
    console.warn(`No se pudo cargar clima para ${query}:`, error);
    const label = badge.querySelector(".weather-label");
    if (label) label.textContent = "Clima no disponible";
  }
}
function showCardWeather(badge, data) {
  badge.querySelector(".weather-icon").textContent = data.icon;
  badge.querySelector(".weather-label").textContent = `${data.temperature}° · ${data.description}`;
}
function makeGenericCard(item) {
  const card = document.createElement("article"); card.className = "destination-card bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group";
  card.dataset.name = favoriteDisplayName(item); card.dataset.category = "ciudades"; card.dataset.popularity = "0"; card.dataset.date = item.guardadoEn || "";
  const visual = document.createElement("div"); visual.className = "relative w-full h-48 overflow-hidden bg-primary-container";
  const image = document.createElement("img"); image.className = "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"; image.alt = `Foto de ${favoriteDisplayName(item)}`; image.src = savedPhoto(item) || "../imagenes/Japon.jpg"; visual.append(image);
  const overlay = document.createElement("div"); overlay.className = "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"; visual.append(overlay);
  const weather = document.createElement("div"); weather.className = "card-weather absolute top-space-sm left-space-sm flex items-center gap-space-xs bg-surface-container-lowest/90 backdrop-blur-md px-space-sm py-space-xs rounded-full shadow-sm"; weather.innerHTML = '<span class="weather-icon material-symbols-outlined text-secondary text-sm">partly_cloudy_day</span><span class="weather-label font-label-sm text-label-sm text-primary-container font-semibold">Cargando clima…</span>'; visual.append(weather);
  const topMeta = document.createElement("div"); topMeta.className = "absolute top-space-sm right-space-sm flex items-center gap-space-xs";
  const currency = document.createElement("span"); currency.className = "bg-primary-container text-on-primary font-label-sm text-label-sm px-space-sm py-space-xs rounded-full shadow-sm"; currency.textContent = savedCurrency(item); topMeta.append(currency);
  const heart = document.createElement("button"); heart.type = "button"; heart.className = "favorite-heart w-8 h-8 rounded-full bg-surface-container-lowest/90 text-on-tertiary-container flex items-center justify-center shadow-sm"; heart.setAttribute("aria-label", "Quitar de favoritos"); heart.innerHTML = '<span class="material-symbols-outlined">favorite</span>'; topMeta.append(heart); visual.append(topMeta);
  const title = document.createElement("div"); title.className = "absolute bottom-space-sm left-space-sm right-space-sm flex items-end justify-between text-on-primary"; const titleText = document.createElement("div"); titleText.append(Object.assign(document.createElement("span"), { className: "font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed", textContent: item.pais || "Destino guardado" }), Object.assign(document.createElement("h3"), { className: "font-title-lg text-title-lg font-bold", textContent: item.ciudad || item.destino || "Destino" })); const rating = document.createElement("button"); rating.type = "button"; rating.className = "destination-rating relative flex items-center gap-space-xs bg-black/50 backdrop-blur-sm px-space-sm py-1 rounded-md hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white"; rating.innerHTML = '<span class="rating-icon material-symbols-outlined text-sm material-symbols-filled">star</span><span class="rating-label font-label-sm text-label-sm font-bold">—</span>'; title.append(titleText, rating); visual.append(title);
  const content = document.createElement("div"); content.className = "p-space-md flex flex-col flex-1 justify-between gap-space-sm";
  const tags = document.createElement("div"); tags.className = "flex flex-wrap gap-space-xs"; tags.append(Object.assign(document.createElement("span"), { className: "bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm px-2 py-0.5 rounded-full", textContent: "Destino guardado" }));
  const actions = document.createElement("div"); actions.className = "flex items-center gap-space-sm pt-space-xs";
  const view = document.createElement("button"); view.type = "button"; view.className = "flex-1 py-1.5 px-space-sm rounded-lg bg-surface-container-low text-primary-container font-label-md text-label-md font-semibold transition-colors flex items-center justify-center gap-1"; view.innerHTML = '<span>Ver Ficha</span><span class="material-symbols-outlined text-sm">arrow_forward</span>';
  const itinerary = document.createElement("button"); itinerary.type = "button"; itinerary.className = "flex-1 py-1.5 px-space-sm rounded-lg bg-secondary text-on-secondary font-label-md text-label-md font-semibold shadow-sm transition-colors flex items-center justify-center gap-1"; itinerary.innerHTML = '<span class="material-symbols-outlined text-sm">calendar_month</span><span>Itinerario</span>';
  actions.append(view, itinerary); content.append(tags, actions); card.append(visual, content); return card;
}
function updateSummary() {
  const cities = cityFavorites();
  const countries = new Set(cities.map((item) => normalizeText(item.pais)).filter(Boolean));
  document.getElementById("favorite-total").textContent = String(cities.length);
  document.getElementById("country-total").textContent = String(countries.size);
  document.getElementById("route-total").textContent = String(readLocal(KEY_TRIPS, []).length);
  document.getElementById("list-count").textContent = `${lists.length} ${lists.length === 1 ? "activa" : "activas"}`;
  const japanSaved = cities.some((item) => item.id === "japon|tokio" || item.id === "japon|kioto");
  document.getElementById("seasonal-suggestion").classList.toggle("hidden", !japanSaved);
}
function applyFilters() {
  let visibleCount = 0;
  cardsContainer.querySelectorAll(".destination-card").forEach((card) => {
    const item = favorites.find((favorite) => String(favorite.id) === card.dataset.favoriteId);
    const queryMatches = !activeQuery || normalizeText(card.dataset.name).includes(normalizeText(activeQuery));
    const listMatches = !activeList || lists.find((list) => list.id === activeList)?.destinos?.includes(card.dataset.favoriteId);
    const visible = Boolean(item && String(item.ciudad || "").trim() && queryMatches && listMatches);
    card.classList.toggle("hidden", !visible); if (visible) visibleCount++;
  });
  let empty = document.getElementById("favorites-empty");
  if (!empty) { empty = document.createElement("p"); empty.id = "favorites-empty"; empty.className = "hidden rounded-xl bg-white p-8 text-center text-on-surface-variant md:col-span-2"; cardsContainer.append(empty); }
  empty.textContent = cityFavorites().length ? "No hay ciudades favoritas que coincidan con la búsqueda." : "";
  empty.classList.toggle("hidden", visibleCount > 0);
  if (!cityFavorites().length) empty.textContent = "Aún no has guardado ciudades favoritas. Usa el corazón en Explorar para añadir una.";
}
function renderFavorites() {
  cardsContainer.replaceChildren();
  cityFavorites().forEach((item) => {
    const displayName = favoriteDisplayName(item);
    const template = cardTemplates.find((card) => cardIdFromName(card.dataset.name) === item.id);
    const card = template ? template.cloneNode(true) : makeGenericCard(item);
    card.dataset.favoriteId = item.id; card.dataset.name = displayName; card.dataset.date = item.guardadoEn || card.dataset.date || "";
    const heart = card.querySelector(".favorite-heart");
    if (heart) { setFavoriteButton(heart, true); heart.setAttribute("aria-label", `Quitar ${displayName} de favoritos`); heart.addEventListener("click", () => removeFavorite(item.id)); }
    const ratingButton = card.querySelector(".destination-rating");
    if (ratingButton) { paintRating(ratingButton, Number(ratings()[item.id] || 0)); ratingButton.addEventListener("click", (event) => { event.stopPropagation(); openRatingPicker(ratingButton, item); }); }
    const weatherBadge = card.querySelector(".card-weather"); if (weatherBadge) loadCardWeather(item, weatherBadge);
    const buttons = card.querySelectorAll(".p-space-md.flex.flex-col.flex-1 button");
    if (buttons[0]) { buttons[0].addEventListener("click", () => { window.location.href = `../index.html?destino=${encodeURIComponent(item.destino || displayName)}#destination-details`; }); }
    if (buttons[1]) { buttons[1].addEventListener("click", () => { window.location.href = `../itinerario/index.html?nuevo=1&destino=${encodeURIComponent(item.destino || displayName)}`; }); }
    const actions = card.querySelector(".p-space-md.flex.flex-col.flex-1 > .flex.items-center.gap-space-sm.pt-space-xs");
    if (actions) { const addList = document.createElement("button"); addList.type = "button"; addList.className = "flex-1 py-1.5 px-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container-high text-primary-container font-label-md text-label-md font-semibold transition-colors flex items-center justify-center gap-1"; addList.innerHTML = '<span class="material-symbols-outlined text-sm">add_circle</span><span>Añadir a lista</span>'; addList.addEventListener("click", () => addFavoriteToList(item.id)); actions.append(addList); }
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
    if (event.key === KEY_TRIPS) updateSummary();
  });
  window.addEventListener("pageshow", () => { favorites = readLocal(KEY_FAVORITES, []); lists = readLocal(KEY_LISTS, []); renderFavorites(); });
});
