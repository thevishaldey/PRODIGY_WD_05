// Weather data from Open-Meteo (free, no API key needed)
const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

// Weather codes -> [description, icon, background style]
const CODES = {
  0: ["Clear sky", "☀️", "clear"],
  1: ["Mostly clear", "🌤️", "clear"],
  2: ["Partly cloudy", "⛅", "cloudy"],
  3: ["Overcast", "☁️", "cloudy"],
  45: ["Fog", "🌫️", "fog"],
  48: ["Freezing fog", "🌫️", "fog"],
  51: ["Light drizzle", "🌦️", "rain"],
  53: ["Drizzle", "🌦️", "rain"],
  55: ["Heavy drizzle", "🌧️", "rain"],
  61: ["Light rain", "🌦️", "rain"],
  63: ["Rain", "🌧️", "rain"],
  65: ["Heavy rain", "🌧️", "rain"],
  71: ["Light snow", "🌨️", "snow"],
  73: ["Snow", "❄️", "snow"],
  75: ["Heavy snow", "❄️", "snow"],
  80: ["Light showers", "🌦️", "rain"],
  81: ["Showers", "🌧️", "rain"],
  82: ["Violent showers", "⛈️", "rain"],
  95: ["Thunderstorm", "⛈️", "storm"],
  96: ["Thunderstorm with hail", "⛈️", "storm"],
  99: ["Severe thunderstorm", "⛈️", "storm"]
};

function getInfo(code) {
  return CODES[code] || ["Unknown", "❔", "cloudy"];
}

const $ = (id) => document.getElementById(id);

let place = null;
let data = null;
let lastSkyKey = "";
let useFahrenheit = localStorage.getItem("useFahrenheit") === "1";

function showStatus(message, isError) {
  $("status").textContent = message;
  $("status").className = isError ? "error" : "";
}

async function getJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("The weather service returned an error (" + response.status + ").");
  }
  return response.json();
}

// Find a city's coordinates from its name
async function searchCity(name) {
  const result = await getJSON(
    GEO_URL + "?name=" + encodeURIComponent(name) + "&count=1&language=en&format=json"
  );
  if (!result.results || result.results.length === 0) {
    throw new Error('No place found for "' + name + '". Check the spelling and try again.');
  }
  const r = result.results[0];
  return {
    lat: r.latitude,
    lon: r.longitude,
    name: [r.name, r.admin1, r.country].filter(Boolean).join(", ")
  };
}

// Find the name of a place from its coordinates (free, no API key needed)
async function getPlaceName(lat, lon) {
  try {
    const result = await getJSON(
      "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" +
        lat + "&longitude=" + lon + "&localityLanguage=en"
    );
    const name = [result.city || result.locality, result.principalSubdivision, result.countryName]
      .filter(Boolean)
      .join(", ");
    return name || "Your location";
  } catch (error) {
    return "Your location"; // if the name lookup fails, the weather still loads
  }
}

// Get the weather for a place
async function loadWeather(newPlace) {
  showStatus("Loading weather...", false);
  try {
    const url =
      WEATHER_URL +
      "?latitude=" + newPlace.lat +
      "&longitude=" + newPlace.lon +
      "&timezone=auto&forecast_days=6" +
      "&current=temperature_2m,apparent_temperature,relative_humidity_2m,is_day,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m" +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,uv_index_max";

    data = await getJSON(url);
    place = newPlace;
    localStorage.setItem("place", JSON.stringify(place));
    showWeather();
    showStatus("", false);
  } catch (error) {
    showStatus(error.message || "Could not load the weather. Please try again.", true);
  }
}

// Helper functions
function temp(celsius) {
  return Math.round(useFahrenheit ? (celsius * 9) / 5 + 32 : celsius);
}

function windDirection(degrees) {
  const names = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return names[Math.round(degrees / 45) % 8];
}

function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

// Build the animated background for the current weather
function showSky(type, isDay) {
  const sky = $("sky");
  sky.innerHTML = "";

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function add(className, style) {
    const div = document.createElement("div");
    div.className = className;
    div.style.cssText = style || "";
    sky.appendChild(div);
  }

  function addClouds(count) {
    for (let i = 0; i < count; i++) {
      add("cloud",
        "top:" + rand(2, 45) + "%;" +
        "scale:" + rand(0.8, 1.8) + ";" +
        "animation-duration:" + rand(40, 90) + "s;" +
        "animation-delay:-" + rand(0, 90) + "s;");
    }
  }

  function addRain(count) {
    for (let i = 0; i < count; i++) {
      add("drop",
        "left:" + rand(0, 100) + "%;" +
        "animation-duration:" + rand(0.6, 1.1) + "s;" +
        "animation-delay:-" + rand(0, 1) + "s;");
    }
  }

  function addSnow(count) {
    for (let i = 0; i < count; i++) {
      const size = rand(4, 9);
      add("flake",
        "left:" + rand(0, 100) + "%;" +
        "width:" + size + "px;height:" + size + "px;" +
        "animation-duration:" + rand(6, 12) + "s;" +
        "animation-delay:-" + rand(0, 12) + "s;");
    }
  }

  if (type === "clear") {
    if (isDay) {
      add("sun");
    } else {
      add("moon");
      for (let i = 0; i < 60; i++) {
        add("star",
          "left:" + rand(0, 100) + "%;top:" + rand(0, 70) + "%;" +
          "animation-delay:-" + rand(0, 3) + "s;");
      }
    }
    addClouds(2);
  } else if (type === "cloudy") {
    addClouds(8);
  } else if (type === "rain") {
    addClouds(7);
    addRain(90);
  } else if (type === "storm") {
    addClouds(7);
    addRain(130);
    add("flash");
  } else if (type === "snow") {
    addClouds(5);
    addSnow(60);
  } else if (type === "fog") {
    for (let i = 0; i < 4; i++) {
      add("fog", "top:" + (10 + i * 22) + "%;animation-delay:-" + rand(0, 20) + "s;");
    }
  }
}

// Put the weather data on the page
function showWeather() {
  const current = data.current;
  const daily = data.daily;
  const info = getInfo(current.weather_code);
  const unit = useFahrenheit ? "°F" : "°C";

  // Change the background
  if (info[2] === "clear") {
    document.body.className = current.is_day ? "clear-day" : "clear-night";
  } else {
    document.body.className = info[2];
  }

  // Rebuild the moving sky only when the weather changes
  const skyKey = info[2] + "-" + current.is_day;
  if (skyKey !== lastSkyKey) {
    showSky(info[2], current.is_day === 1);
    lastSkyKey = skyKey;
  }

  // Main section
  $("place").textContent = place.name;
  $("when").textContent = "Updated " + new Date(current.time).toLocaleString([], {
    weekday: "long",
    hour: "numeric",
    minute: "2-digit"
  });
  $("temp").textContent = temp(current.temperature_2m);
  $("unitLabel").textContent = unit;
  $("icon").textContent = info[1];
  $("cond").textContent = info[0];
  $("range").textContent =
    "High " + temp(daily.temperature_2m_max[0]) + "° / Low " + temp(daily.temperature_2m_min[0]) + "°";

  // Detail boxes
  const wind = useFahrenheit
    ? Math.round(current.wind_speed_10m * 0.621) + " mph"
    : Math.round(current.wind_speed_10m) + " km/h";

  const details = [
    ["Feels like", temp(current.apparent_temperature) + "°"],
    ["Humidity", current.relative_humidity_2m + "%"],
    ["Wind", wind + " " + windDirection(current.wind_direction_10m)],
    ["Pressure", Math.round(current.pressure_msl) + " hPa"],
    ["Cloud cover", current.cloud_cover + "%"],
    ["Rain chance", (daily.precipitation_probability_max[0] || 0) + "%"],
    ["UV index", Math.round(daily.uv_index_max[0])],
    ["Sunrise / Sunset", formatTime(daily.sunrise[0]) + " / " + formatTime(daily.sunset[0])]
  ];

  $("details").innerHTML = details
    .map((item) => '<div class="detail"><span>' + item[0] + "</span><strong>" + item[1] + "</strong></div>")
    .join("");

  // 5-day forecast (skip today)
  let forecastHTML = "";
  for (let i = 1; i <= 5; i++) {
    const dayName = new Date(daily.time[i] + "T12:00").toLocaleDateString([], { weekday: "long" });
    const dayInfo = getInfo(daily.weather_code[i]);
    forecastHTML +=
      "<li><span>" + dayName + "</span>" +
      "<span>" + dayInfo[1] + " " + dayInfo[0] + "</span>" +
      "<span>" + temp(daily.temperature_2m_max[i]) + "° / " + temp(daily.temperature_2m_min[i]) + "°</span></li>";
  }
  $("forecast").innerHTML = forecastHTML;

  $("unitBtn").textContent = useFahrenheit ? "Switch to °C" : "Switch to °F";
  $("weather").hidden = false;
}

// Use the browser's location
function useMyLocation() {
  if (!navigator.geolocation) {
    showStatus("Your browser doesn't support location. Search for a city instead.", true);
    return;
  }
  showStatus("Finding your location...", false);
  navigator.geolocation.getCurrentPosition(
    async function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const name = await getPlaceName(lat, lon);
      loadWeather({ lat: lat, lon: lon, name: name });
    },
    function () {
      showStatus("Couldn't get your location. Allow access or search for a city.", true);
    }
  );
}

// Events
$("search").addEventListener("submit", async function (event) {
  event.preventDefault();
  const city = $("q").value.trim();
  if (!city) {
    showStatus("Enter a city name first.", true);
    return;
  }
  showStatus("Searching...", false);
  try {
    loadWeather(await searchCity(city));
  } catch (error) {
    showStatus(error.message, true);
  }
});

$("locate").addEventListener("click", useMyLocation);

$("unitBtn").addEventListener("click", function () {
  useFahrenheit = !useFahrenheit;
  localStorage.setItem("useFahrenheit", useFahrenheit ? "1" : "0");
  showWeather();
});

// On page load: use the last place, or ask for location
const saved = localStorage.getItem("place");
if (saved) {
  loadWeather(JSON.parse(saved));
} else {
  useMyLocation();
}