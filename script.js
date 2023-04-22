document.addEventListener("DOMContentLoaded", function() {
    // your JavaScript code here
    // buttons for saved searched cities
const historySection = document.getElementById ("history")
const history = JSON.parse(localStorage.getItem("history")) || []
history.forEach (city => {
  const button = document.createElement("button")
  button.textContent = city
  button.value = city
  button.addEventListener("click",() => search(city))

  historySection.appendChild (button)
})
  
// OpenWeather API key
// var APIKey = "http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=7dbe892b50ac11cedcc74b682866adaa";
// var city;
// var temp;
// var wind;
// var humidity;

//1. In search field when "search" button is clicked it needs to retrieve info( current and future conditions for that city) from OpenWeather API
//2. After info is retrieved it needs to be displayed.
//3. Display info:  city name, the date, weather icon, temperature, humidity, and wind speed.
//3. After info is displayed it needs to be saved to local storage
//
function search(city) {
  const apiKey = '1cb5087d8292aae70cc804206ec947b0';
    const units = 'imperial'; // use imperial for Fahrenheit, or metric for Celsius
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(data => {
        if (!history.includes(city)) {
          const button = document.createElement("button")
            button.textContent = city
            button.value = city
            button.addEventListener("click",() => search(city))
            historySection.appendChild (button)
            history.push(city)
            localStorage.setItem("history",JSON.stringify(history))
        }
        // Extract weather data from API response
        const temperature = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const icon = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
        const windspeed = data.wind.speed

        // Update HTML elements with weather data
        document.querySelector('#temperature').textContent = `${temperature} °F`;
        document.querySelector('#description').textContent = description;
        document.querySelector('#weather-icon').setAttribute('src', icon);

        // Make API request for 5-day forecast
        return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`);
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(data => {
        // Extract forecast data from API response
        const forecast = data.list.slice(0, 5);
        console.log (data)

        // Update HTML elements with forecast data
        // forecast.forEach((item, index) => {
          let index = 0
          for (let i = 0; i < data.list.length; i+=8){
            const item = data.list[i]
            console.log (item)
          const date = new Date(item.dt * 1000);
          const day = date.toLocaleString('en-US', {weekday: 'short'});
          const temperature = Math.round(item.main.temp);
          const humidity = item.main?.humidity; 
          const windspeed = item.wind.speed
          

          console.log(item); // or console.log(item.main);

          const icon = `https://openweathermap.org/img/w/${item.weather[0].icon}.png`;
          console.log(`#icon${index+1}`)
          document.querySelector(`#day${index+1}`).textContent = day;
          document.querySelector(`#temp${index+1}`).textContent = `${temperature} °F`;
          document.querySelector(`#humidity${index+1}`).textContent = `Humidity: ${humidity}%`;
          document.querySelector(`#windspeed${index+1}`).textContent = `Windspeed: ${windspeed}%`;
          document.querySelector(`#icon${index+1}`).setAttribute('src', icon);
          index++
        // });
          }
      })
      .catch(error => {
        console.error(error);
      });
}
// Add event listener to the form submit button
// Function to make API call and update weather data
document.querySelector('#search-form').addEventListener('submit', (event) => {
    event.preventDefault(); // prevent default form submit behavior
    const city = document.querySelector('#search-city').value.trim();

    // Make API request to OpenWeatherAPI
search(city)
    
  });
});


  