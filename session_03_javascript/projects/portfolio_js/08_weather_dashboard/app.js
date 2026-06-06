// ===== CONFIG =====
const API_KEY = 'd959046e';  // Thay bằng key của bạn
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// ===== STATE =====
let unit = localStorage.getItem('tempUnit') || 'metric'; // 'metric' = °C, 'imperial' = °F
let searchHistory = JSON.parse(localStorage.getItem('weatherHistory')) || [];

// ===== DOM ELEMENTS =====
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const unitToggle = document.getElementById('unit-toggle');
const geoBtn = document.getElementById('geo-btn');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const currentWeather = document.getElementById('current-weather');
const forecastSection = document.getElementById('forecast-section');
const searchHistoryEl = document.getElementById('search-history');
const historyTags = document.getElementById('history-tags');

async function fetchWeather(query) {
    // query có thể là tên thành phố hoặc {lat, lon}
    showLoading(true);
    hideError();

    try {
        let weatherUrl, forecastUrl;

        if (typeof query === 'string') {
            // Tìm theo tên thành phố
            weatherUrl = `${BASE_URL}/weather?q=${encodeURIComponent(query)}&appid=${API_KEY}&units=${unit}&lang=vi`;
            forecastUrl = `${BASE_URL}/forecast?q=${encodeURIComponent(query)}&appid=${API_KEY}&units=${unit}&lang=vi`;
        } else {
            // Tìm theo tọa độ
            weatherUrl = `${BASE_URL}/weather?lat=${query.lat}&lon=${query.lon}&appid=${API_KEY}&units=${unit}&lang=vi`;
            forecastUrl = `${BASE_URL}/forecast?lat=${query.lat}&lon=${query.lon}&appid=${API_KEY}&units=${unit}&lang=vi`;
        }

        const [weatherRes, forecastRes] = await Promise.all([
            fetch(weatherUrl),
            fetch(forecastUrl)
        ]);

        if (!weatherRes.ok) {
            throw new Error(weatherRes.status === 404
                ? 'Không tìm thấy thành phố. Vui lòng kiểm tra lại!'
                : 'Lỗi kết nối API. Thử lại sau!'
            );
        }

        const weatherData = await weatherRes.json();
        const forecastData = await forecastRes.json();

        // Render
        renderCurrentWeather(weatherData);
        renderForecast(forecastData);
        addToHistory(weatherData.name);

    } catch (error) {
        showError(error.message);
    } finally {
        showLoading(false);
    }
}

function renderCurrentWeather(data) {
    currentWeather.hidden = false;

    // City name & date
    document.getElementById('city-title').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('vi-VN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    // Main weather
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById('weather-icon').src = iconUrl;
    document.getElementById('weather-icon').alt = data.weather[0].description;
    document.getElementById('weather-description').textContent = data.weather[0].description;

    // Temperature
    const tempUnit = unit === 'metric' ? '°C' : '°F';
    document.getElementById('current-temp').textContent = `${Math.round(data.main.temp)}${tempUnit}`;
    document.getElementById('feels-like').textContent = `Cảm giác như ${Math.round(data.main.feels_like)}${tempUnit}`;

    // Details
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('wind').textContent = `${data.wind.speed} ${unit === 'metric' ? 'm/s' : 'mph'}`;
    document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
    document.getElementById('sunrise').textContent = formatTime(data.sys.sunrise, data.timezone);
    document.getElementById('sunset').textContent = formatTime(data.sys.sunset, data.timezone);

    // Dynamic background
    setWeatherBackground(data.weather[0].id, data.weather[0].icon);
}

function renderForecast(data) {
    forecastSection.hidden = false;
    const forecastGrid = document.getElementById('forecast-grid');

    // Lấy 1 forecast mỗi ngày (12:00 PM)
    const dailyForecasts = data.list
        .filter(item => item.dt_txt.includes('12:00:00'))
        .slice(0, 5);

    const tempUnit = unit === 'metric' ? '°C' : '°F';

    forecastGrid.innerHTML = dailyForecasts.map(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('vi-VN', { weekday: 'short' });
        const dateStr = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

        return `
            <div class="forecast-card">
                <div class="forecast-day">${dayName}</div>
                <div class="forecast-date">${dateStr}</div>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
                     alt="${day.weather[0].description}"
                     class="forecast-icon">
                <div class="forecast-temp">
                    <span class="temp-high">${Math.round(day.main.temp_max)}°</span>
                    <span class="temp-low">${Math.round(day.main.temp_min)}°</span>
                </div>
                <div class="forecast-desc">${day.weather[0].description}</div>
            </div>
        `;
    }).join('');
}

function formatTime(timestamp, timezoneOffset) {
    // Convert UTC timestamp + timezone offset → local time
    const date = new Date((timestamp + timezoneOffset) * 1000);
    return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
    });
}

function setWeatherBackground(weatherId, icon) {
    const body = document.body;
    const isNight = icon.includes('n');

    if (isNight) {
        body.style.background = 'linear-gradient(135deg, #1a1a2e, #16213e)';
    } else if (weatherId >= 200 && weatherId < 300) {
        // Thunderstorm
        body.style.background = 'linear-gradient(135deg, #2c3e50, #4ca1af)';
    } else if (weatherId >= 300 && weatherId < 600) {
        // Rain/Drizzle
        body.style.background = 'linear-gradient(135deg, #616161, #9bc5c3)';
    } else if (weatherId >= 600 && weatherId < 700) {
        // Snow
        body.style.background = 'linear-gradient(135deg, #e6dada, #274046)';
    } else if (weatherId >= 700 && weatherId < 800) {
        // Atmosphere (fog, mist)
        body.style.background = 'linear-gradient(135deg, #757f9a, #d7dde8)';
    } else if (weatherId === 800) {
        // Clear
        body.style.background = 'linear-gradient(135deg, #f093fb, #f5576c)';
    } else {
        // Clouds
        body.style.background = 'linear-gradient(135deg, #89f7fe, #66a6ff)';
    }
}

function addToHistory(cityName) {
    // Remove duplicates & keep max 5
    searchHistory = searchHistory.filter(c => c.toLowerCase() !== cityName.toLowerCase());
    searchHistory.unshift(cityName);
    searchHistory = searchHistory.slice(0, 5);

    localStorage.setItem('weatherHistory', JSON.stringify(searchHistory));
    renderHistory();
}

function renderHistory() {
    if (searchHistory.length === 0) {
        searchHistoryEl.hidden = true;
        return;
    }

    searchHistoryEl.hidden = false;
    historyTags.innerHTML = searchHistory.map(city =>
        `<button class="history-tag" data-city="${city}">${city}</button>`
    ).join('');
}

function showLoading(show) {
    loading.hidden = !show;
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = false;
}

function hideError() {
    errorMessage.hidden = true;
}

function getGeolocation() {
    if (!navigator.geolocation) {
        showError('Trình duyệt không hỗ trợ Geolocation');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            fetchWeather({
                lat: position.coords.latitude,
                lon: position.coords.longitude
            });
        },
        (error) => {
            showError('Không thể lấy vị trí. Vui lòng cho phép truy cập vị trí!');
            console.error('Geolocation error:', error);
        }
    );
}


function toggleUnit() {
    unit = unit === 'metric' ? 'imperial' : 'metric';
    localStorage.setItem('tempUnit', unit);
    unitToggle.textContent = unit === 'metric' ? '°C' : '°F';

    // Re-fetch if there's current data
    const cityTitle = document.getElementById('city-title');
    if (cityTitle.textContent) {
        const cityName = cityTitle.textContent.split(',')[0];
        fetchWeather(cityName);
    }
}


// Search
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
});

cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) fetchWeather(city);
    }
});

// History tags (event delegation)
historyTags.addEventListener('click', (e) => {
    const tag = e.target.closest('.history-tag');
    if (tag) {
        cityInput.value = tag.dataset.city;
        fetchWeather(tag.dataset.city);
    }
});

// Unit toggle
unitToggle.addEventListener('click', toggleUnit);

// Geolocation
geoBtn.addEventListener('click', getGeolocation);

// Init
unitToggle.textContent = unit === 'metric' ? '°C' : '°F';
renderHistory();