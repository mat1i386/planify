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

    let isFavorite = true;
    function toggleFavorite() {
      isFavorite = !isFavorite;
      const favText = document.getElementById('fav-text');
      const favIcon = document.getElementById('fav-icon');
      if (isFavorite) {
        favText.innerText = 'En Favoritos';
        favIcon.style.fontVariationSettings = "'FILL' 1";
      } else {
        favText.innerText = 'AÃ±adir a Favoritos';
        favIcon.style.fontVariationSettings = "'FILL' 0";
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

  document.getElementById("itinerary-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    saveItineraryAlert();
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
    throw new Error(`No se pudo consultar la API (${response.status})`);
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
