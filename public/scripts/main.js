var currentLatitude = "";
var currentLongitude = "";
var image = document.getElementById("weather-icon");
var locDescription = document.getElementById("locDescription");
var locationDescription= "No location Details available"
document.getElementById("locDescription").innerHTML = "Your Location: " + locationDescription;
var degrees = "C";
var celciusTemp = "";
var privateKey = apiKey.PRIVATE_KEY;
document.getElementById("changeTemp").disabled = true;


navigator.geolocation.getCurrentPosition(function(position) {
  function errorCallback(error) {
  alert('ERROR(' + error.code + '): ' + error.message);
};
  getWeatherInfo(position.coords.latitude, position.coords.longitude);
  getLocationDetails(position.coords.latitude, position.coords.longitude);

});

function getLocationDetails(lat, long) {
  // NOTE: The locations provided by the weather api used have many problems. In order to get a "clean" formatted location
  // I used an api from  https://geocoder.opencagedata.com/ to get clean location descriptions (really cool descriptions sometimes
  // in larger cities). That api has limited daily uses so if you are trying to run this you will need to register and get
  // your own free key. Simply insert this key into the variable private key
  fetch("https://api.opencagedata.com/geocode/v1/json?q=" + currentLatitude + "%2C+"+ currentLongitude + "&pretty=1&key=" + privateKey)

  .then(function(response) {
      return response.json();
  }).then(function(jsonData) {

      if(jsonData.results["0"].formatted) {
        locationDescription = jsonData.results["0"].formatted
        document.getElementById("locDescription").innerHTML = "Your Location: " + locationDescription;
      } else {
        return;
      }
  }).catch(function(err) {
      console.log("Opps, Something went wrong with the Location Name API!", err);
  })

}

function roundNumber(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}


function getWeatherInfo(lat, long) {
  currentLatitude = (roundNumber(lat,3));
  currentLongitude = (roundNumber(long, 3));
  document.getElementById("status").innerHTML = "Lat: " + currentLatitude + "  Long: " + currentLongitude;
  fetch("https://fcc-weather-api.glitch.me/api/current?lat=" + encodeURIComponent(currentLongitude) + "&lon=" + encodeURIComponent(currentLatitude))
  .then(function(response) {
      return response.json();
  }).then(function(jsonData) {

      if (jsonData.weather[0].icon) {
        document.getElementById("weather-icon").setAttribute("src", jsonData.weather[0].icon);
      } else {
        document.getElementById("no-image-from-api").innerHTML =
        "<p>Sorry, the API has problems often and will not send the necessary image, but it is FREE! Click the reload button below to refresh the page.</p><button onclick=\"reloadPage()\">Reload</button>";
        document.getElementById("weather-icon").setAttribute("src", "images/noWeather.png");
      }

      if (jsonData.main.temp) {
        celciusTemp = (roundNumber(jsonData.main.temp, 1));
        fahrenheitTemp = (roundNumber(((jsonData.main.temp * 1.8) + 32), 0));
        document.getElementById("temp-display").innerHTML = jsonData.main.temp;
        document.getElementById("cOrF").innerHTML = degrees +"°";
      }
      document.getElementById("changeTemp").disabled = false;
  }).catch(function(err) {
      console.log("Oops, Something went wrong with the weather API!(As usual)", err);
  })

}

function reloadPage(){
  window.location.reload();
}

function changeTemperature(){
  if(degrees === "C"){
    degrees = "F";
    document.getElementById("temp-display").innerHTML = fahrenheitTemp;
    document.getElementById("cOrF").innerHTML = degrees + "°";
    document.getElementById("celciusOrFahrenheit").innerHTML = "Celcius";
  } else {
    degrees = "C";
    document.getElementById("temp-display").innerHTML = celciusTemp;
    document.getElementById("cOrF").innerHTML = degrees + "°";
    document.getElementById("celciusOrFahrenheit").innerHTML = "Fahrenheit";
  }
}
