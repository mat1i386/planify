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

function quickFilter(destination) {
      const input = document.getElementById('search-input');
      const title = document.getElementById('current-destination-title');
      const tripDest = document.getElementById('trip-destination');
      if (input) input.value = destination;
      if (title) title.innerText = destination;
      if (tripDest) tripDest.value = destination;
      buscarDestino(destination);
    }

    function triggerSearch() {
      const input = document.getElementById('search-input');
      const title = document.getElementById('current-destination-title');
      const tripDest = document.getElementById('trip-destination');
      if (input && input.value) {
        if (title) title.innerText = input.value;
        if (tripDest) tripDest.value = input.value;
        buscarDestino(input.value);
      }
    }

    function saveItineraryAlert() {
      const alert = document.getElementById('save-alert');
      if (alert) {
        alert.classList.remove('hidden');
        alert.classList.add('flex');
        setTimeout(() => {
          alert.classList.add('hidden');
          alert.classList.remove('flex');
        }, 4000);
      }
    }

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("search-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    triggerSearch();
  });

  document.querySelectorAll("[data-quick-filter]").forEach((button) => {
    button.addEventListener("click", () => quickFilter(button.dataset.quickFilter));
  });

  document.getElementById("favorite-btn")?.addEventListener("click", toggleFavorite);

  const formItinerario = document.getElementById("itinerary-form");
  formItinerario?.addEventListener("input", (event) => event.target.setCustomValidity?.(""));
  formItinerario?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (guardarItinerario()) saveItineraryAlert();
  });
});

const API_KEY = "rc_live_a713887abaf140b993ff04839a7984f9";

function obtenerPaisDesdeDestino(destination) {
  const value = destination.trim();
  const commaParts = value.split(",");
  return commaParts.length > 1
    ? commaParts[commaParts.length - 1].trim()
    : value.split(" - ")[0].trim();
}

const CAMPOS = "names,codes,capitals,region,subregion,population,languages,currencies,timezones";

const normalizar = (texto) =>
  texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

function obtenerMoneda(currencies) {
  if (!currencies) return null;
  if (Array.isArray(currencies)) return currencies[0];
  const [codigo, datos] = Object.entries(currencies)[0] || [];
  return datos ? { code: codigo, ...datos } : null;
}

function obtenerIdioma(languages) {
  const idioma = Array.isArray(languages) ? languages[0] : Object.values(languages || {})[0];
  if (typeof idioma === "string") return idioma;
  return idioma?.name || idioma?.english_name || idioma?.native_name || "No disponible";
}

function limpiarFicha() {
  ["capital", "region", "population", "language", "currency", "timezone"].forEach((campo) => {
    const element = document.getElementById(`destination-${campo}`);
    if (element) element.textContent = "No disponible";
  });
}

function actualizarFichaGeopolitica(country) {
  console.log("Datos del país:", country); // bórralo cuando confirmes que todo se ve bien

  const currency = obtenerMoneda(country.currencies);
  const simbolo = currency?.symbol ? ` ${currency.symbol}` : "";
  const population = typeof country.population === "number"
    ? `${(country.population / 1000000).toFixed(1)} M`
    : "No disponible";

  const fields = {
    "destination-capital":
      country.capitals?.find((capital) => capital.attributes?.primary)?.name ||
      country.capitals?.[0]?.name ||
      "No disponible",
    "destination-region": country.subregion || country.region || "No disponible",
    "destination-population": population,
    "destination-language": obtenerIdioma(country.languages),
    "destination-currency": currency
      ? `${currency.name || currency.code} (${currency.code || ""}${simbolo})`
      : "No disponible",
    "destination-timezone": country.timezones?.[0] || "No disponible"
  };

  Object.entries(fields).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  });
}

async function pedirPaises(ruta, texto) {
  const url = `https://api.restcountries.com/countries/v5/${ruta}?q=${encodeURIComponent(texto)}&response_fields=${CAMPOS}&limit=25`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${API_KEY}` }
  });

  if (!response.ok) {
    const cuerpo = await response.json().catch(() => null);
    throw new Error(`(${response.status}) ${cuerpo?.errors?.[0]?.message || "Sin detalle"}`);
  }

  const data = await response.json();
  return data.data?.objects || [];
}

function elegirPais(lista, texto) {
  const buscado = normalizar(texto);
  return (
    lista.find(
      (pais) =>
        normalizar(pais.names?.translations?.spa?.common || "") === buscado ||
        normalizar(pais.names?.common || "") === buscado
    ) || lista[0]
  );
}

async function buscarDestino(destination) {
  const countryName = obtenerPaisDesdeDestino(destination);
  if (!countryName) return;
    actualizarBotonFavorito();
  cargarClima(destination);
  try {
    let lista = await pedirPaises("names.translations", countryName); // nombre en español
    if (!lista.length) lista = await pedirPaises("name", countryName); // nombre en inglés o nativo

    const country = elegirPais(lista, countryName);
    if (!country) {
      throw new Error("La API no devolvió información del destino");
    }

    actualizarFichaGeopolitica(country);
  } catch (error) {
    console.error("Error al consultar REST Countries:", error);
    limpiarFicha();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  if (searchInput?.value) buscarDestino(searchInput.value);
});

/* ===================== localStorage ===================== */
const CLAVE_FAVORITOS = "planify:favoritos";
const CLAVE_ITINERARIOS = "planify:itinerarios";
const CLAVE_COORDENADAS = "planify:coordenadas";

function leerStorage(clave, porDefecto) {
  try {
    const valor = localStorage.getItem(clave);
    return valor ? JSON.parse(valor) : porDefecto;
  } catch (error) {
    console.error(`No se pudo leer "${clave}" de localStorage:`, error);
    return porDefecto;
  }
}

function guardarStorage(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch (error) {
    console.error(`No se pudo guardar "${clave}" en localStorage:`, error);
    return false;
  }
}

/* ===================== Destino (título azul) ===================== */
function separarDestino(destination) {
  const valor = destination.trim();
  if (valor.includes(",")) {
    const partes = valor.split(",").map((parte) => parte.trim());
    return { ciudad: partes[0], pais: partes[partes.length - 1] };
  }
  if (valor.includes(" - ")) {
    const [pais, ciudad] = valor.split(" - ").map((parte) => parte.trim());
    return { pais, ciudad };
  }
  return { pais: valor, ciudad: "" };
}

function destinoActual() {
  return document.getElementById("current-destination-title")?.textContent.trim() || "";
}

/* ===================== Favoritos ===================== */
function idDestino(destination) {
  const { pais, ciudad } = separarDestino(destination);
  return `${normalizar(pais)}|${normalizar(ciudad)}`;
}

function obtenerFavoritos() {
  return leerStorage(CLAVE_FAVORITOS, []);
}

function actualizarBotonFavorito() {
  const favText = document.getElementById("fav-text");
  const favIcon = document.getElementById("fav-icon");
  if (!favText || !favIcon) return;

  const id = idDestino(destinoActual());
  const esFavorito = obtenerFavoritos().some((favorito) => favorito.id === id);

  favText.textContent = esFavorito ? "En Favoritos" : "Añadir a Favoritos";
  favIcon.style.fontVariationSettings = esFavorito ? "'FILL' 1" : "'FILL' 0";
}

function toggleFavorite() {
  const destino = destinoActual();
  if (!destino) return;

  const id = idDestino(destino);
  const favoritos = obtenerFavoritos();
  const yaExiste = favoritos.some((favorito) => favorito.id === id);

  const actualizados = yaExiste
    ? favoritos.filter((favorito) => favorito.id !== id) // eliminar
    : [...favoritos, { id, destino, ...separarDestino(destino), guardadoEn: new Date().toISOString() }]; // agregar sin duplicar

  guardarStorage(CLAVE_FAVORITOS, actualizados);
  actualizarBotonFavorito();
}

/* ===================== Itinerario (formulario) ===================== */
function guardarItinerario() {
  const nombre = document.getElementById("trip-name");
  const destino = document.getElementById("trip-destination");
  const inicio = document.getElementById("trip-start");
  const fin = document.getElementById("trip-end");
  const presupuesto = document.getElementById("trip-budget");
  const notas = document.getElementById("trip-notes");
  const campos = [nombre, destino, inicio, fin];

  campos.forEach((campo) => campo.setCustomValidity(""));

  if (nombre.value.trim().length < 3) {
    nombre.setCustomValidity("El nombre del viaje debe tener al menos 3 caracteres.");
  }
  if (!destino.value.trim()) {
    destino.setCustomValidity("Indica el destino del viaje.");
  }
  if (!inicio.value) {
    inicio.setCustomValidity("Selecciona la fecha de inicio.");
  }
  if (!fin.value) {
    fin.setCustomValidity("Selecciona la fecha de fin.");
  } else if (inicio.value && fin.value < inicio.value) {
    fin.setCustomValidity("La fecha de fin no puede ser anterior a la de inicio.");
  }

  const invalido = campos.find((campo) => !campo.validity.valid);
  if (invalido) {
    invalido.reportValidity();
    return false;
  }

  const itinerarios = leerStorage(CLAVE_ITINERARIOS, []);
  itinerarios.push({
    id: Date.now(),
    nombre: nombre.value.trim(),
    destino: destino.value.trim(),
    inicio: inicio.value,
    fin: fin.value,
    presupuesto: presupuesto?.value.trim() || "",
    notas: notas?.value.trim() || "",
    creadoEn: new Date().toISOString()
  });
  return guardarStorage(CLAVE_ITINERARIOS, itinerarios);
}

/* ===================== Clima: Nominatim + Open-Meteo ===================== */
const CLIMA_CODIGOS = [
  [[0], "Despejado", "clear_day"],
  [[1], "Mayormente despejado", "sunny"],
  [[2], "Parcialmente nublado", "partly_cloudy_day"],
  [[3], "Nublado", "cloud"],
  [[45, 48], "Niebla", "foggy"],
  [[51, 53, 55, 56, 57], "Llovizna", "rainy"],
  [[61], "Lluvia ligera", "rainy"],
  [[63], "Lluvia moderada", "rainy"],
  [[65], "Lluvia fuerte", "rainy"],
  [[66, 67], "Lluvia helada", "rainy"],
  [[71, 73, 75, 77, 85, 86], "Nevada", "weather_snowy"],
  [[80, 81, 82], "Chubascos", "rainy"],
  [[95, 96, 99], "Tormenta", "thunderstorm"]
];

function describirClima(codigo) {
  const fila = CLIMA_CODIGOS.find(([codigos]) => codigos.includes(codigo));
  return fila ? { texto: fila[1], icono: fila[2] } : { texto: "Sin datos", icono: "cloud" };
}

function clasificarAqi(aqi) {
  if (aqi <= 50) return { texto: "Buena", clase: "text-secondary" };
  if (aqi <= 100) return { texto: "Moderada", clase: "text-on-tertiary-container" };
  if (aqi <= 150) return { texto: "Dañina (sensibles)", clase: "text-error" };
  if (aqi <= 200) return { texto: "Dañina", clase: "text-error" };
  return { texto: "Muy dañina", clase: "text-error" };
}

function etiquetaDia(fecha, posicion) {
  if (posicion === 1) return "Mañana";
  const texto = new Date(`${fecha}T12:00:00`).toLocaleDateString("es", { weekday: "short", day: "numeric" });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function ponerTexto(id, texto) {
  const element = document.getElementById(id);
  if (element) element.textContent = texto;
}

async function obtenerCoordenadas(destination) {
  const { pais, ciudad } = separarDestino(destination);
  const consulta = [ciudad, pais].filter(Boolean).join(", ");
  const clave = normalizar(consulta);

  const cache = leerStorage(CLAVE_COORDENADAS, {});
  if (cache[clave]) return cache[clave]; // evita repetir llamadas a Nominatim

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(consulta)}&format=jsonv2&limit=1&accept-language=es`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Nominatim respondió ${response.status}`);

  const resultados = await response.json();
  if (!resultados.length) throw new Error(`No se encontraron coordenadas para "${consulta}"`);

  const coordenadas = { lat: Number(resultados[0].lat), lon: Number(resultados[0].lon) };
  cache[clave] = coordenadas;
  guardarStorage(CLAVE_COORDENADAS, cache);
  return coordenadas;
}

async function pedirClima(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    timezone: "auto",
    forecast_days: 4
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!response.ok) throw new Error(`Open-Meteo respondió ${response.status}`);
  return response.json();
}

async function pedirCalidadAire(lat, lon) {
  const params = new URLSearchParams({ latitude: lat, longitude: lon, current: "us_aqi", timezone: "auto" });
  const response = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${params}`);
  if (!response.ok) throw new Error(`Open-Meteo Air Quality respondió ${response.status}`);
  return response.json();
}

function pintarClima(clima, aire) {
  const actual = clima.current;
  const descripcion = describirClima(actual.weather_code);

  ponerTexto("weather-temp", `${Math.round(actual.temperature_2m)}°`);
  ponerTexto("weather-feels", `Sensación térmica: ${Math.round(actual.apparent_temperature)}°C`);
  ponerTexto("weather-condition-text", descripcion.texto);
  ponerTexto("weather-condition-icon", descripcion.icono);
  ponerTexto("weather-main-icon", descripcion.icono);
  ponerTexto("weather-humidity", `${Math.round(actual.relative_humidity_2m)}%`);
  ponerTexto("weather-wind", `${Math.round(actual.wind_speed_10m)} km/h`);

  const aqi = aire?.current?.us_aqi;
  const aqiElement = document.getElementById("weather-aqi");
  if (aqiElement) {
    aqiElement.classList.remove("text-secondary", "text-on-tertiary-container", "text-error");
    if (typeof aqi === "number") {
      const nivel = clasificarAqi(aqi);
      aqiElement.textContent = `${Math.round(aqi)} ${nivel.texto}`;
      aqiElement.classList.add(nivel.clase);
    } else {
      aqiElement.textContent = "No disponible";
      aqiElement.classList.add("text-secondary");
    }
  }

  const diario = clima.daily;
  for (let i = 1; i <= 3; i++) {
    const dia = describirClima(diario.weather_code[i]);
    const lluvia = diario.precipitation_probability_max?.[i];
    ponerTexto(`forecast-day-${i}`, etiquetaDia(diario.time[i], i));
    ponerTexto(`forecast-icon-${i}`, dia.icono);
    ponerTexto(`forecast-desc-${i}`, typeof lluvia === "number" ? `${dia.texto} · ${lluvia}% lluvia` : dia.texto);
    ponerTexto(`forecast-max-${i}`, `${Math.round(diario.temperature_2m_max[i])}°C`);
    ponerTexto(`forecast-min-${i}`, `${Math.round(diario.temperature_2m_min[i])}°C`);
  }

  ponerTexto("weather-updated", `Actualizado a las ${actual.time.slice(11, 16)} (hora local del destino) vía Open-Meteo`);
}

function mostrarErrorClima(mensaje) {
  ponerTexto("weather-temp", "--°");
  ponerTexto("weather-feels", "Sensación térmica: --");
  ponerTexto("weather-condition-text", "Sin datos");
  ponerTexto("weather-humidity", "--");
  ponerTexto("weather-wind", "--");
  ponerTexto("weather-aqi", "--");
  ponerTexto("weather-updated", mensaje);
}

let ultimaSolicitudClima = 0;

async function cargarClima(destination) {
  const solicitud = ++ultimaSolicitudClima;
  ponerTexto("weather-updated", "Cargando clima…");

  try {
    const { lat, lon } = await obtenerCoordenadas(destination);
    const [resClima, resAire] = await Promise.allSettled([pedirClima(lat, lon), pedirCalidadAire(lat, lon)]);

    if (solicitud !== ultimaSolicitudClima) return; // llegó tarde: el usuario ya eligió otro destino
    if (resClima.status === "rejected") throw resClima.reason;

    pintarClima(resClima.value, resAire.status === "fulfilled" ? resAire.value : null);
  } catch (error) {
    if (solicitud !== ultimaSolicitudClima) return;
    console.error("Error al cargar el clima:", error);
    mostrarErrorClima("No se pudo cargar el clima de este destino.");
  }
}