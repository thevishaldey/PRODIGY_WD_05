PRODIGY_WD_05

Task 5 : 🌤️Weather App

This project is one of the many intern projects for Web Development Internship at Prodigy InfoTech. In this, we were supposed to make A simple, responsive weather web app built with HTML, CSS and vanilla JavaScript. It shows the current weather for your location or any city you search for, along with a 5-day forecast and a background that animates to match the weather.
__________________________________________________________________________________________________________________________________________________________________________
✨ Features
- Automatic location: detects your location with the browser Geolocation API and shows your place name.
- City search: look up weather for any city in the world.
- Current conditions: temperature, weather description and icon, today's high and low
- More details: feels-like temperature, humidity, wind speed and direction, pressure, cloud cover, chance of rain, UV index, sunrise and sunset.
- 5-day forecast: daily conditions with high and low temperatures.
- °C / °F toggle: your choice is remembered.
- Weather-based animated background:
   - Clear day: glowing sun.
   - Clear night: moon and twinkling stars.
   - Cloudy: slowly moving clouds.
   - Rain: falling raindrops.
   - Thunderstorm: heavy rain with lightning flashes.
   - Snow: falling snowflakes.
   - Fog: drifting mist.
- Remembers your last searched place.
- Responsive design for mobile and desktop.
- Clear error messages (city not found, location blocked, network problem).
__________________________________________________________________________________________________________________________________________________________________________
🛠️ Built With
- HTML5: page structure
- CSS3: layout, gradients and animations
- JavaScript (ES6): fetch API, async/await, DOM manipulation, localStorage
- Open-Meteo API: weather data and city geocoding (free, no API key needed)
- BigDataCloud Reverse Geocoding: turns your coordinates into a place name
__________________________________________________________________________________________________________________________________________________________________________
📁 Project Structure
weather-app/
├── index.html     # Page structure
├── style.css      # Styling and weather
Animations
├── script.js      # API calls and app logic
__________________________________________________________________________________________________________________________________________________________________________
📖 How It Works
1. When you search for a city, the app calls the Open-Meteo Geocoding API to get its latitude and longitude
2. When you click My location, the browser provides your coordinates, and BigDataCloud converts them into a place name.
3. The coordinates are sent to the Open-Meteo Forecast API, which returns current conditions and a daily forecast.
4. The weather code from the API decides the description, icon, background color and animation shown on the page.
__________________________________________________________________________________________________________________________________________________________________________
📝 Notes
- If you block location access, the app asks you to search for a city instead.
- If your system has "reduce motion" turned on, the background animations are disabled.
- The free APIs used here are meant for personal and learning projects.
___________________________________________________________________________________________________________________________________________________________________________
👤 Author : Vishal Dey
- GitHub: @thevishaldey
- LinkedIn: https://www.linkedin.com/in/vishal-dey-aa3362356/
___________________________________________________________________________________________________________________________________________________________________________







