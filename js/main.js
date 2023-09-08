let prevSelectedOption = null; //? To keep track of the previously selected option
const selectElement = document.getElementById("cities");

selectElement.addEventListener("change", function () {
  // todo Get the selected option
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const optionValue = JSON.parse(selectedOption.value);
  //? Extract lat and lon
  const lat = optionValue.lat;
  const lon = optionValue.lon;
  // Reset the color of the previously selected option (if any)
  if (prevSelectedOption) {
    prevSelectedOption.style.color = ""; // Reset to default color
  }
  // Set the color of the selected option to the desired color
  selectedOption.style.color = "gray"; // Change to your desired color
  // Update the previous selected option to the current one
  prevSelectedOption = selectedOption;
  //   console.log(optionValue);
  //   console.log(lat);
  //   console.log(lon);
  fetchForcast(lon, lat)
    .then((res) => {
      showWeatherData(res);
    })
    .catch((error) => {
      console.log(error);
      console.log("Something happend");
    });
});

// const API_CIVIL ="http://www.7timer.info/bin/api.pl?lon=113.17&lat=23.09&product=civillight&output=json";
const fetchForcast = async (lon, lat) => {
  const FULL_FETCH = `http://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civillight&output=json`;
  const res = await fetch(FULL_FETCH);
  const data = await res.json();
  // console.log(data.dataseries);
  //   console.log(data.dataseries.map(e=>e.weather));
  return data;
};

const showWeatherData = (weatherData) => {
  const fetchedData = weatherData.dataseries; // Assuming dataseries is an array in your weatherData object
  const weatherListElement = document.getElementById("weather-list");

  // Clear previous data
  weatherListElement.innerHTML = "";

  if (fetchedData.length === 0) {
    // Display a "No data available" message
    const noDataMessage = document.createElement("div");
    noDataMessage.textContent = "No data available";
    weatherListElement.appendChild(noDataMessage);
  } else {
    // Display a loading message while fetching data
    const loadingMessage = document.createElement("div");
    loadingMessage.textContent = "Loading...";
    weatherListElement.appendChild(loadingMessage);

    // Simulate fetching data with a setTimeout (replace this with your actual data fetching code)
    setTimeout(() => {
      // Remove the loading message
      weatherListElement.removeChild(loadingMessage);

      // Iterate over the dataseries array and create HTML elements for each data point
      fetchedData.forEach((data) => {
        const inputDate = `${data.date}`; // Replace this with your input date string
        const year = inputDate.slice(0, 4);
        const month = inputDate.slice(4, 6) - 1; // Subtract 1 since months are 0-indexed in JavaScript
        const day = inputDate.slice(6, 8);

        const dateObj = new Date(year, month, day);

        const options = { weekday: "short", month: "short", day: "numeric" };
        const formattedDate = dateObj.toLocaleDateString("en-US", options);

        // Create a new .card-weather element for each data point
        const listItem = document.createElement("div");
        listItem.classList.add("card-weather");

        listItem.innerHTML = `
          <div class="text-center">
            <h5>${formattedDate}</h5>
            <img src='../images/${data.weather}.png' class="card-img-top img-weather" alt=${data.weather}>
            <div class="card-body pt-4">
              <h5 class="card-title weather-title">${data.weather}</h5>
              <div class="mt-4">
                <p class="m-0">max:${data.temp2m.max}</p>
                <p class="m-0">min:${data.temp2m.min}</p>
              </div>
            </div>
          </div>
        `;

        weatherListElement.appendChild(listItem);
      });
    }, 2000); // Simulate a 1-second delay for fetching data (replace with actual data fetching code)
  }
};

