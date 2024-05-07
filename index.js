let api_key = '08dd146b42bee258294692a615049941';
const grantAccessBtn = document.querySelector("[data-grant-button]");
const cityname = document.querySelector(".cityname");
const weatherDesc = document.querySelector(".weatherDesc");
const weatherImg = document.querySelector(".weather-img");
const temp = document.querySelector(".temp");
const windspeed = document.querySelector(".windspeed");
const humidity = document.querySelector(".humidity");
const cloud = document.querySelector(".clouds");
const countryFlag = document.querySelector(".countryFlag");
const locationContainer = document.querySelector(".location-container");
const yourWeatherTab = document.querySelector("[data-your-weather]");
const SearchContainer = document.querySelector(".search-container");
const searchtab = document.querySelector("[data-search-weather]");
const searchBtn = document.querySelector("[data-search-button]");
const yourWeatherContainer = document.querySelector("[data-your-container]");
const loading = document.querySelector(".loading-container");
const cityValue = document.querySelector("[data-search-city]");

function checkSession() {
    if (sessionStorage.getItem("userCoordinates")) {
        locationContainer.classList.add("hidden");
        SearchContainer.classList.add("hidden");
    } else {
        locationContainer.classList.remove("hidden");
        SearchContainer.classList.add("hidden");
        yourWeatherContainer.classList.add("hidden");
    }
}

checkSession();

let currentTab = yourWeatherTab;
if (currentTab === yourWeatherTab) {
    yourWeatherTab.classList.add("current-tab");
}

getyourWeatherTab();
yourWeatherTab.addEventListener("click", () => {
    switchTab(yourWeatherTab);
});

searchtab.addEventListener("click", () => {
    switchTab(searchtab);
});

function switchTab(clickedTab) {
    if (clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
    } else {
        return;
    }

    if (clickedTab === searchtab) {
        yourWeatherContainer.classList.add("hidden");
        SearchContainer.classList.remove("hidden");
        locationContainer.classList.add("hidden");
    } else {
        SearchContainer.classList.add("hidden");

        if (sessionStorage.getItem("userCoordinates")) {
            yourWeatherContainer.classList.remove("hidden");
        }
        getyourWeatherTab();
    }
}

cityValue.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        let cityV = cityValue.value;
        searchCity(cityV);
    }
});

searchBtn.addEventListener("click", () => {
    let cityV = cityValue.value;
    searchCity(cityV);
});

async function searchCity(cityV) {
    loading.classList.remove("hidden");
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityV}&appid=${api_key}`)
    let data = await response.json();
    loading.classList.add("hidden");
    yourWeatherContainer.classList.remove("hidden");

    render(data);
}

function getyourWeatherTab() {
    const cord = sessionStorage.getItem("userCoordinates");
    if (cord) {
        const coord = JSON.parse(cord);
        fetchinfo(coord);
    } else {
        locationContainer.classList.remove("hidden");
    }
}

grantAccessBtn.addEventListener("click", getlocation);

function getlocation() {
    locationContainer.classList.add("hidden");
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(getPosition, handleLocationError);
    } else {
        console.error("Geolocation is not supported by your browser");
    }
}

async function getPosition(position) {
    const localCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };
    sessionStorage.setItem("userCoordinates", JSON.stringify(localCoordinates));
    fetchinfo(localCoordinates);
}

async function fetchinfo(localCoordinates) {
    loading.classList.remove("hidden");
    let lat = localCoordinates.lat;
    let lon = localCoordinates.lon;
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`);
    const data = await response.json();
    loading.classList.add("hidden");
    yourWeatherContainer.classList.remove("hidden");
    render(data);
}

function handleLocationError(error) {
    console.error(`Error getting location: ${error.message}`);
}

function render(data) {
    cityname.innerText = data?.name;
    countryFlag.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = data?.weather[0]?.description;
    weatherImg.src = `http://openweathermap.org/img/w/${data?.weather[0]?.icon}.png`;
    temp.innerText = (Math.ceil(parseInt(data?.main?.temp)) - 273) + "°C";
    windspeed.innerText = data?.wind?.speed;
    humidity.innerText = data?.main?.humidity;
    cloud.innerText = data?.clouds?.all;
}
