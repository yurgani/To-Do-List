// ключи API для OpenWeatherMap и TimeZoneDB
const api = "abf7b427dfdc1baa7fad1748e3aaf0e8";
const timezoneApi = "RGTDZ6WMYXXJ";

//элементы на странице
const temp = document.querySelector(".graduce");
const date = document.querySelector(".date");
const city = document.querySelector(".name_weather");



function getWeatherAndTimezone() {
  navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // URL для запроса погоды
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=ru&units=metric&appid=${api}`;

    // Получаем погоду и устанавливаем интервал для обновления времени и погоды
    getWeather(weatherUrl);
    getTimezone(position.coords.latitude, position.coords.longitude);
    setInterval(() => getTimezone(lat, lon), 60000);
    setInterval(() => getWeather(weatherUrl), 60000);
  });
}


// функция для получения погоды по URL
function getWeather(url) {
  $.ajax({
    method: "GET",
    url: url})
  .done(function(response) {
    temp.innerHTML = response.main.temp.toFixed(1) + "°C"; // обновляем температуру
    city.innerHTML = response.name; // обновляем название город
})};

// функция для получения временной зоны по координатам
function getTimezone(lat, lon) {
  // формируем URL для запроса временной зоны
  const timezoneUrl = `https://api.timezonedb.com/v2.1/get-time-zone?key=${timezoneApi}&format=json&by=position&lat=${lat}&lng=${lon}`;
  // получаем временную зону и обновляем время на странице
  $.ajax({
    method: "GET",
    url: timezoneUrl,})
    .done(function(response) {
      date.innerHTML = response.formatted.slice(0, 11) + " – " + response.formatted.slice(11, response.formatted.length - 3); // обновляем время
})};




getWeatherAndTimezone();