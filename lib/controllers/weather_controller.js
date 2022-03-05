import { Controller } from "@hotwired/stimulus";

const apiKey = process.env['API_KEY'];

const getIconUrl = (icon) => {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
};

const getGeoUrl = (location) => {
  return `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${apiKey}`;
};

const getweatherUrl = (lat, lon) => {
  return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
};

export default class extends Controller {
  static targets = ['cityInput', 'submit', 'cityName', 'date', 'desc', 'temp', 'icon']

  getWeather(event) {
    event.preventDefault();
    const location = this.cityInputTarget.value;
    fetch(getGeoUrl(location))
      .then(response => response.json())
      .then((data) => {
        console.log(data);
        const lat = data[0].lat;
        const lon = data[0].lon;

        fetch(getweatherUrl(lat, lon))
          .then(response => response.json())
          .then((weatherData) => {
            console.log(weatherData);
            this.cityNameTarget.innerText = weatherData.name;

            const today = new Date();
            const todayStr = today.toDateString();
            this.dateTarget.innerText = todayStr;
            this.descTarget.innerText = weatherData.weather[0].description;
            this.tempTarget.innerText = `${(weatherData.main.temp - 273.15).toFixed(2)} °C`;
            this.iconTarget.src = getIconUrl(weatherData.weather[0].icon);
          });
      });
  }
}
