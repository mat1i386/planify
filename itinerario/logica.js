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

const KEY_TRIPS = "planify:itinerarios";
const KEY_ACTIVITIES = "planify:actividades-cronograma";
const KEY_SELECTED_TRIP = "planify:itinerario-seleccionado";
let trips = [];
let selectedTrip = null;
let itemType = "";
let editingTrip = false;

function readStorage(key, fallback) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
  catch (error) { console.error(`No se pudo leer ${key}:`, error); return fallback; }
}
function writeStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch (error) { console.error(`No se pudo guardar ${key}:`, error); notify("No se pudo guardar: el almacenamiento del navegador no está disponible."); return false; }
}
function notify(message) {
  let node = document.getElementById("app-notice");
  if (!node) { node = document.createElement("p"); node.id = "app-notice"; node.className = "fixed bottom-4 left-1/2 z-[90] -translate-x-1/2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg print:hidden"; node.setAttribute("role", "status"); document.body.append(node); }
  node.textContent = message; node.classList.remove("hidden"); clearTimeout(notify.timer); notify.timer = setTimeout(() => node.classList.add("hidden"), 3500);
}
function formatMoney(value) { return new Intl.NumberFormat("es-CO", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(Number(value) || 0); }
function formatDate(value) { return value ? new Date(`${value}T12:00:00`).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" }) : ""; }
function safeText(tag, text, className = "") { const node = document.createElement(tag); node.textContent = text ?? ""; if (className) node.className = className; return node; }
function getAllTrips() { const value = readStorage(KEY_TRIPS, []); return Array.isArray(value) ? value : []; }
function numericBudget(value) { const normalized = String(value ?? "").replace(/[^0-9,.-]/g, "").replace(/,(?=\d{3}(?:[.,]|$))/g, "").replace(",", "."); const amount = Number(normalized); return Number.isFinite(amount) ? amount : 0; }
function getExpenses(trip = selectedTrip) { return Array.isArray(trip?.expenses) ? trip.expenses : []; }
function getReservations(trip = selectedTrip) { return Array.isArray(trip?.reservations) ? trip.reservations : []; }
function getActivities(trip = selectedTrip) { return Array.isArray(trip?.activities) ? trip.activities : []; }
function persistTrips() { return writeStorage(KEY_TRIPS, trips); }
function syncLegacyActivities() {
  const legacy = readStorage(KEY_ACTIVITIES, []);
  if (!Array.isArray(legacy) || !legacy.length || !trips.length) return;
  const unassigned = legacy.filter((activity) => !activity.itinerarioId);
  if (!unassigned.length) return;
  const target = trips[trips.length - 1];
  target.activities = Array.isArray(target.activities) ? target.activities : [];
  unassigned.forEach((activity) => {
    if (!target.activities.some((saved) => String(saved.id) === String(activity.id))) {
      target.activities.push({ ...activity, itinerarioId: target.id });
      activity.itinerarioId = target.id;
    }
  });
  writeStorage(KEY_ACTIVITIES, legacy);
  persistTrips();
}
function updateSelector() {
  const select = document.getElementById("trip-selector");
  const container = document.getElementById("trip-selector-container");
  select.replaceChildren();
  trips.forEach((trip) => {
    const option = document.createElement("option"); option.value = String(trip.id); option.textContent = trip.nombre; select.append(option);
  });
  container.classList.toggle("hidden", !trips.length);
  if (selectedTrip) select.value = String(selectedTrip.id);
}
function selectTrip(id) {
  selectedTrip = trips.find((trip) => String(trip.id) === String(id)) || null;
  if (!selectedTrip) return;
  localStorage.setItem(KEY_SELECTED_TRIP, String(selectedTrip.id));
  document.getElementById("trip-dashboard").classList.remove("hidden");
  updateSelector();
  renderDashboard();
  renderView(document.querySelector(".trip-tab.bg-primary")?.dataset.view || "activities");
}
function renderDashboard() {
  if (!selectedTrip) return;
  const start = formatDate(selectedTrip.inicio); const end = formatDate(selectedTrip.fin);
  const duration = selectedTrip.inicio && selectedTrip.fin ? Math.max(1, Math.round((new Date(`${selectedTrip.fin}T12:00:00`) - new Date(`${selectedTrip.inicio}T12:00:00`)) / 86400000) + 1) : 0;
  document.getElementById("trip-name").textContent = selectedTrip.nombre || "";
  document.getElementById("trip-destination").textContent = selectedTrip.destino || "";
  document.getElementById("trip-dates").textContent = [start && end ? `${start} – ${end}` : "", duration ? `${duration} ${duration === 1 ? "día" : "días"}` : ""].filter(Boolean).join(" · ");
  document.getElementById("trip-notes").textContent = selectedTrip.notas || "";
  const budget = numericBudget(selectedTrip.presupuesto);
  const spent = getExpenses().reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0);
  document.getElementById("trip-budget").textContent = budget ? formatMoney(budget) : "Sin presupuesto";
  document.getElementById("budget-summary").textContent = `${formatMoney(spent)} gastados${budget ? ` · ${formatMoney(Math.max(0, budget - spent))} disponibles` : ""}`;
  document.getElementById("budget-progress").style.width = `${budget ? Math.min(100, spent / budget * 100) : 0}%`;
  document.getElementById("activity-summary").textContent = `${getActivities().length} ${getActivities().length === 1 ? "actividad" : "actividades"}`;
  document.getElementById("reservation-summary").textContent = `${getReservations().length} ${getReservations().length === 1 ? "reserva" : "reservas"}`;
}
function emptyMessage(text) { return safeText("p", text, "rounded-lg bg-surface-container-low p-5 text-sm text-on-surface-variant"); }
function actionButton(text, action, danger = false) { const button = safeText("button", text, `rounded-lg px-3 py-2 text-sm font-semibold ${danger ? "text-error hover:bg-error-container" : "text-primary hover:bg-surface-container"}`); button.type = "button"; button.addEventListener("click", action); return button; }
function removeRecord(collection, id, label) {
  selectedTrip[collection] = selectedTrip[collection].filter((item) => String(item.id) !== String(id));
  if (collection === "activities") {
    const all = readStorage(KEY_ACTIVITIES, []);
    writeStorage(KEY_ACTIVITIES, all.filter((item) => String(item.id) !== String(id)));
  }
  if (persistTrips()) { renderDashboard(); renderView(collection === "expenses" ? "expenses" : collection === "reservations" ? "reservations" : "activities"); notify(`${label} eliminada.`); }
}
function renderActivities(root) {
  const activities = [...getActivities()].sort((a, b) => Number(a.day) - Number(b.day) || String(a.time || "").localeCompare(String(b.time || "")));
  root.append(actionButton("Añadir actividad", () => openItemModal("activity"), false));
  if (!activities.length) { root.append(emptyMessage("Este itinerario todavía no tiene actividades.")); return; }
  const list = document.createElement("div"); list.className = "mt-4 space-y-3";
  activities.forEach((activity) => {
    const card = document.createElement("article"); card.className = "flex items-start gap-3 rounded-xl bg-surface-container-low p-4";
    const badge = safeText("span", `D${String(activity.day || 1).padStart(2, "0")}`, "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-container font-bold text-white");
    const body = document.createElement("div"); body.className = "min-w-0 flex-1";
    const head = document.createElement("div"); head.className = "flex flex-wrap items-start justify-between gap-2";
    head.append(safeText("h3", activity.title, "font-semibold text-primary")); if (Number(activity.cost)) head.append(safeText("span", formatMoney(activity.cost), "font-semibold text-secondary"));
    body.append(head); if (activity.time) body.append(safeText("p", activity.time, "text-xs text-outline")); if (activity.description) body.append(safeText("p", activity.description, "mt-1 text-sm text-on-surface-variant"));
    card.append(badge, body, actionButton("Eliminar", () => removeRecord("activities", activity.id, "Actividad"), true)); list.append(card);
  }); root.append(list);
}
function renderExpenses(root) {
  const expenses = [...getExpenses()].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  const total = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const header = document.createElement("div"); header.className = "mb-4 flex flex-wrap items-center justify-between gap-3";
  header.append(safeText("p", `Total registrado: ${formatMoney(total)}`, "text-lg font-bold text-primary"), actionButton("Añadir gasto", () => openItemModal("expense"))); root.append(header);
  if (!expenses.length) { root.append(emptyMessage("Todavía no hay gastos registrados.")); return; }
  const list = document.createElement("div"); list.className = "divide-y divide-surface-container";
  expenses.forEach((expense) => { const row = document.createElement("div"); row.className = "flex flex-wrap items-center justify-between gap-3 py-3"; const left = document.createElement("div"); left.append(safeText("p", expense.title, "font-semibold text-primary"), safeText("p", `${expense.category || "Otro"}${expense.date ? ` · ${formatDate(expense.date)}` : ""}`, "text-sm text-on-surface-variant")); row.append(left, safeText("span", formatMoney(expense.amount), "font-semibold text-secondary"), actionButton("Eliminar", () => removeRecord("expenses", expense.id, "Gasto"), true)); list.append(row); }); root.append(list);
}
function renderReservations(root) {
  const reservations = [...getReservations()].sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")));
  root.append(actionButton("Añadir reserva", () => openItemModal("reservation")));
  if (!reservations.length) { root.append(emptyMessage("Todavía no hay reservas ni vouchers.")); return; }
  const list = document.createElement("div"); list.className = "mt-4 space-y-3";
  reservations.forEach((reservation) => { const card = document.createElement("article"); card.className = "flex flex-wrap items-start justify-between gap-3 rounded-lg bg-surface-container-low p-4"; const detail = document.createElement("div"); detail.append(safeText("h3", reservation.title, "font-semibold text-primary"), safeText("p", [reservation.provider, formatDate(reservation.date), reservation.code && `Código: ${reservation.code}`].filter(Boolean).join(" · "), "mt-1 text-sm text-on-surface-variant")); card.append(detail, actionButton("Eliminar", () => removeRecord("reservations", reservation.id, "Reserva"), true)); list.append(card); }); root.append(list);
}
function renderMap(root) {
  root.append(safeText("h2", "Mapa del recorrido", "text-xl font-bold text-primary"));
  root.append(safeText("p", selectedTrip.destino, "mt-2 text-on-surface-variant"));
  const link = document.createElement("a"); link.className = "mt-4 inline-flex rounded-lg bg-secondary px-4 py-2 font-semibold text-white"; link.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedTrip.destino)}`; link.target = "_blank"; link.rel = "noopener noreferrer"; link.textContent = "Abrir destino en Google Maps"; root.append(link);
  const activities = getActivities(); if (activities.length) { root.append(safeText("h3", "Paradas planificadas", "mt-6 font-semibold text-primary")); activities.forEach((activity) => root.append(safeText("p", `Día ${activity.day}: ${activity.title}`, "mt-2 text-sm text-on-surface-variant"))); }
}
function renderView(view) {
  if (!selectedTrip) return;
  const root = document.getElementById("trip-view"); root.replaceChildren();
  if (view === "expenses") renderExpenses(root); else if (view === "reservations") renderReservations(root); else if (view === "map") renderMap(root); else renderActivities(root);
  document.querySelectorAll(".trip-tab").forEach((tab) => { const active = tab.dataset.view === view; tab.classList.toggle("bg-primary", active); tab.classList.toggle("text-white", active); tab.classList.toggle("bg-white", !active); tab.classList.toggle("text-primary", !active); });
}
function openTripModal(trip = null) {
  editingTrip = Boolean(trip); const modal = document.getElementById("trip-modal"); const form = document.getElementById("trip-form");
  form.reset(); if (trip) for (const [key, value] of Object.entries(trip)) { const control = form.elements.namedItem(key); if (control && typeof value !== "object") control.value = key === "presupuesto" ? (numericBudget(value) || "") : (value ?? ""); }
  document.getElementById("trip-modal-title").textContent = trip ? "Editar itinerario" : "Nuevo plan de viaje";
  document.getElementById("trip-error").classList.add("hidden"); modal.hidden = false; form.elements.nombre.focus();
}
function closeModal(modal) { modal.hidden = true; }
function field(label, name, type = "text", required = false, extra = "") { const wrap = document.createElement("label"); wrap.className = "block text-sm font-semibold text-on-surface"; wrap.append(document.createTextNode(label)); const input = document.createElement(type === "textarea" ? "textarea" : "input"); input.className = "form-field"; input.name = name; if (type !== "textarea") input.type = type; input.required = required; if (extra) input.setAttribute("data-extra", extra); wrap.append(input); return wrap; }
function openItemModal(type) {
  itemType = type; const modal = document.getElementById("item-modal"); const fields = document.getElementById("item-fields"); fields.replaceChildren(); document.getElementById("item-error").classList.add("hidden");
  const specs = type === "activity" ? [["Actividad", "title", "text", true], ["Día del viaje", "day", "number", true], ["Hora", "time", "time", false], ["Costo planificado (USD)", "cost", "number", false], ["Descripción", "description", "textarea", false]] : type === "expense" ? [["Concepto", "title", "text", true], ["Monto (USD)", "amount", "number", true], ["Categoría", "category", "text", false], ["Fecha", "date", "date", false]] : [["Reserva o voucher", "title", "text", true], ["Proveedor / lugar", "provider", "text", false], ["Fecha", "date", "date", false], ["Código de confirmación", "code", "text", false]];
  document.getElementById("item-modal-title").textContent = type === "activity" ? "Añadir actividad" : type === "expense" ? "Registrar gasto" : "Añadir reserva";
  specs.forEach(([label, name, typeName, required]) => { const node = field(label, name, typeName, required); if (name === "day") { node.querySelector("input").min = "1"; node.querySelector("input").value = "1"; } if (name === "cost" || name === "amount") { const input = node.querySelector("input"); input.min = "0"; input.step = "0.01"; } fields.append(node); }); modal.hidden = false;
}
function handleItemSubmit(event) {
  event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); const record = Object.fromEntries(data.entries()); record.id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  if (itemType === "activity") { record.day = Number(record.day); record.cost = Number(record.cost || 0); selectedTrip.activities.push(record); const legacy = readStorage(KEY_ACTIVITIES, []); legacy.push({ ...record, itinerarioId: selectedTrip.id }); writeStorage(KEY_ACTIVITIES, legacy); }
  if (itemType === "expense") { record.amount = Number(record.amount); selectedTrip.expenses.push(record); }
  if (itemType === "reservation") selectedTrip.reservations.push(record);
  if (persistTrips()) { const view = itemType === "expense" ? "expenses" : itemType === "reservation" ? "reservations" : "activities"; renderDashboard(); renderView(view); closeModal(document.getElementById("item-modal")); form.reset(); notify("Cambios guardados."); }
}
function deleteSelectedTrip() {
  if (!selectedTrip || !confirm(`¿Eliminar el itinerario “${selectedTrip.nombre}” y sus actividades, gastos y reservas?`)) return;
  const removedId = selectedTrip.id; trips = trips.filter((trip) => String(trip.id) !== String(removedId));
  const legacy = readStorage(KEY_ACTIVITIES, []); writeStorage(KEY_ACTIVITIES, legacy.filter((activity) => String(activity.itinerarioId) !== String(removedId)));
  localStorage.removeItem(KEY_SELECTED_TRIP); selectedTrip = null; persistTrips(); loadApp(); notify("Itinerario eliminado.");
}
function exportCalendar() {
  if (!selectedTrip) return; const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Planify//Itinerario//ES"];
  getActivities().forEach((activity) => { const start = new Date(`${selectedTrip.inicio}T12:00:00Z`); start.setUTCDate(start.getUTCDate() + Math.max(0, Number(activity.day || 1) - 1)); const date = `${start.getUTCFullYear()}${String(start.getUTCMonth()+1).padStart(2,"0")}${String(start.getUTCDate()).padStart(2,"0")}`; const time = String(activity.time || "").replace(":", ""); lines.push("BEGIN:VEVENT", `UID:${activity.id}@planify.local`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`, activity.time ? `DTSTART:${date}T${time}00` : `DTSTART;VALUE=DATE:${date}`, `SUMMARY:${String(activity.title).replace(/[\\,;]/g, "\\$&")}`, "END:VEVENT"); });
  lines.push("END:VCALENDAR"); downloadFile(`${selectedTrip.nombre}.ics`, lines.join("\r\n"), "text/calendar;charset=utf-8");
}
function downloadFile(name, content, type) { const blob = new Blob([content], { type }); const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = name.replace(/[\\/:*?"<>|]/g, "-"); link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 1000); }
async function shareTrip() { if (!selectedTrip) return; const text = `${selectedTrip.nombre} · ${selectedTrip.destino} · ${formatDate(selectedTrip.inicio)} – ${formatDate(selectedTrip.fin)}`; try { if (navigator.share) await navigator.share({ title: selectedTrip.nombre, text }); else { await navigator.clipboard.writeText(text); notify("Resumen copiado al portapapeles."); } } catch (error) { if (error.name !== "AbortError") notify("No se pudo compartir desde este navegador."); } }
function loadApp() {
  trips = getAllTrips();
  trips.forEach((trip) => { if (!Array.isArray(trip.activities)) trip.activities = []; if (!Array.isArray(trip.expenses)) trip.expenses = []; if (!Array.isArray(trip.reservations)) trip.reservations = []; });
  syncLegacyActivities(); trips = getAllTrips();
  trips.forEach((trip) => { if (!Array.isArray(trip.activities)) trip.activities = []; if (!Array.isArray(trip.expenses)) trip.expenses = []; if (!Array.isArray(trip.reservations)) trip.reservations = []; });
  const dashboard = document.getElementById("trip-dashboard"); const remembered = localStorage.getItem(KEY_SELECTED_TRIP);
  if (!trips.length) { dashboard.classList.add("hidden"); document.getElementById("trip-selector-container").classList.add("hidden"); selectedTrip = null; updateSelector(); return; }
  updateSelector(); const trip = trips.find((item) => String(item.id) === remembered) || trips[trips.length - 1]; selectTrip(trip.id);
}
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("open-trip-modal").addEventListener("click", () => openTripModal());
  document.getElementById("close-trip-modal").addEventListener("click", () => closeModal(document.getElementById("trip-modal")));
  document.getElementById("cancel-trip-modal").addEventListener("click", () => closeModal(document.getElementById("trip-modal")));
  document.getElementById("trip-modal").addEventListener("click", (event) => { if (event.target.id === "trip-modal") closeModal(event.currentTarget); });
  document.getElementById("item-modal").addEventListener("click", (event) => { if (event.target.id === "item-modal" || event.target.closest("[data-close-item]")) closeModal(document.getElementById("item-modal")); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") { closeModal(document.getElementById("trip-modal")); closeModal(document.getElementById("item-modal")); } });
  document.getElementById("trip-form").addEventListener("submit", (event) => {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); const start = String(data.get("inicio")); const end = String(data.get("fin")); const error = document.getElementById("trip-error");
    if (end < start) { error.textContent = "La fecha final debe ser igual o posterior a la fecha inicial."; error.classList.remove("hidden"); return; }
    const values = { nombre: String(data.get("nombre")).trim(), destino: String(data.get("destino")).trim(), inicio: start, fin: end, presupuesto: Number(data.get("presupuesto") || 0), notas: String(data.get("notas") || "").trim() };
    if (editingTrip && selectedTrip) Object.assign(selectedTrip, values); else { const trip = { id: Date.now(), ...values, activities: [], expenses: [], reservations: [], creadoEn: new Date().toISOString() }; trips.push(trip); localStorage.setItem(KEY_SELECTED_TRIP, String(trip.id)); }
    if (!persistTrips()) return; closeModal(document.getElementById("trip-modal")); form.reset(); loadApp(); notify(editingTrip ? "Itinerario actualizado." : "Itinerario creado."); editingTrip = false;
  });
  document.getElementById("item-form").addEventListener("submit", handleItemSubmit);
  document.getElementById("trip-selector").addEventListener("change", (event) => selectTrip(event.target.value));
  document.querySelectorAll(".trip-tab").forEach((tab) => tab.addEventListener("click", () => renderView(tab.dataset.view)));
  document.getElementById("delete-trip-btn").addEventListener("click", deleteSelectedTrip);
  document.getElementById("edit-trip-btn").addEventListener("click", () => openTripModal(selectedTrip));
  document.getElementById("export-ics-btn").addEventListener("click", exportCalendar);
  document.getElementById("print-trip-btn").addEventListener("click", () => window.print());
  document.getElementById("share-trip-btn").addEventListener("click", shareTrip);
  loadApp();
  window.addEventListener("storage", (event) => {
    if ([KEY_TRIPS, KEY_ACTIVITIES].includes(event.key)) loadApp();
  });
});
