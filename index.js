async function airports() {
  const response = await fetch(
    "https://davidmegginson.github.io/ourairports-data/airports.csv",
  );
  return await response.text();
}

async function main() {
  const loading = document.getElementsByTagName("p")[0];
  console.log(loading);

  let lat;
  let long;

  const list = await airports();

  function successCallback(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;

    console.log(`Latitude: ${lat}, Longitude: ${long}`);
  }

  function errorCallback(position) {
    console.log(`error lmao`);
  }

  if ("geolocation" in navigator) {
    const options = {
      enableHighAccuracy: true, // Forces GPS use if available
      timeout: 5000, // Time in ms before throwing an error
      maximumAge: 0, // Forces a fresh look up instead of cached data
    };

    // 2. Request the current position
    navigator.geolocation.getCurrentPosition(
      successCallback,
      errorCallback,
      options,
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
  }

  // 3. Handle a successful response

  let response = await fetch(`https://sounds.liamfissell.com/api/secret/BNA`);

  let data = await response.json();

  console.log(await data);

  if (await data.today.error) {
    loading.textContent = `${await data.tomorrow.best_flights[0].flights[0].flight_number} arrives tomorrow ${await data.tomorrow.best_flights[0].flights[0].arrival_airport.time.split(" ")[1]}`;
  } else {
    loading.textContent = `${await data.today.best_flights[0].flights[0].flight_number} arrives today ${await data.today.best_flights[0].flights[0].arrival_airport.time.split(" ")[1]}`;
  }
}

main();
