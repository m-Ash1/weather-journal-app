const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const apiKey = "d2042921245a8fe12e5530a3e008a30a&units=metric";

/* Global Variables */
const zip = document.getElementById("zip");
const feeling = document.getElementById("feelings");
const button = document.getElementById("generate");
let date = document.getElementById("date");

// Create a new date instance dynamically with JS
let newDate;
document.body.onload = function () {
  //  to get the date when the page is loaded
  let d = new Date();
  date.innerHTML = `${weekday[d.getDay()]}, ${d.getDate()} ${d.toLocaleString(
    "en-us",
    {
      month: "short",
    }
  )} ${d.getFullYear()}
  <br>
  ${d.getHours() + ":" + d.getMinutes()} ${d.getHours() >= 12 ? "pm" : "am"}`;
};

button.addEventListener("click", () => {
  // to verify that the user entered a zip code and a feeling
  if (zip.value.trim() === "" || feeling.value.trim() === "") {
    alert("Please fill the required fields");
    return;
  }
  // to get the date when the button is clicked
  let d = new Date();
  newDate = `${weekday[d.getDay()]}, ${d.getDate()} ${d.toLocaleString(
    "en-us",
    {
      month: "short",
    }
  )} ${d.getFullYear()} ${d.getHours() + ":" + d.getMinutes()} ${
    d.getHours() >= 12 ? "pm" : "am"
  }`;
  getWeatherData(zip.value, feeling.value, apiKey)
    .then((data) => {
      return postData("/data/send", data);
    })
    .then(() => {
      updateUI();
    });
});

// Get weather data from OpenWeatherMap API
async function getWeatherData(zip, feeling, apiKey) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apiKey}`
  );
  try {
    const data = await response.json();
    data.feelings = feeling;
    data.date = newDate;
    return data;
  } catch (error) {
    console.log("error", error);
  }
}

// Send data to the server
async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log("error", error);
  }
}

// Update UI
async function updateUI() {
  const request = await fetch("/data/get");
  try {
    // Transform into JSON
    const allData = await request.json();

    updateDataInPage(allData);
    createRecentEntry(allData);
  } catch (error) {
    console.log("error", error);
  }
}

function updateDataInPage(allData) {
  let temp = document.getElementById("temp");
  temp.innerHTML = `${allData.main.temp}°c`;

  let feelsLike = document.getElementById("feels-like");
  feelsLike.innerHTML = `${allData.main.feels_like}°c`;

  let humidity = document.getElementById("humidity");
  humidity.innerHTML = `${allData.main.humidity}%`;

  let Pressure = document.getElementById("pressure");
  Pressure.innerHTML = `${allData.main.pressure} hPa`;

  let windSpeed = document.getElementById("wind-speed");
  windSpeed.innerHTML = `${allData.wind.speed} km/h`;

  let tempDesc = document.getElementById("temp-description");
  tempDesc.innerHTML = `${allData.weather[0].description}`;

  let entryHolder = document.createElement("div");
  entryHolder.className = "entryHolder";
}

function createRecentEntry(allData) {
  let entryHolder = document.createElement("div");
  entryHolder.className = "entryHolder";

  let date = document.createElement("div");
  date.id = "date";
  date.innerHTML = newDate;

  let temp = document.createElement("div");
  temp.id = "temp";
  temp.innerHTML = `${allData.main.temp}°c`;

  let content = document.createElement("div");
  content.id = "content";
  content.innerHTML = allData.feelings;

  entryHolder.appendChild(date);
  entryHolder.appendChild(temp);
  entryHolder.appendChild(content);
  let recentData = document.getElementsByClassName("recent-data")[0];
  recentData.appendChild(entryHolder);
}
