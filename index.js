async function airports() {
  const response = await fetch("airports_small.csv");
  return await response.text();
}

async function populate(pos) {
  const list = await airports();

  let lat = pos.coords.latitude * (Math.PI / 180);
  let long = pos.coords.longitude * (Math.PI / 180);

  const loading = document.getElementsByTagName("p")[0];

  let parsed = Papa.parse(list);

  console.log(parsed.data[0]);
  parsed.data.shift();
  console.log(parsed.data[0]);

  for (const airport of parsed.data) {
    let check_lat = parseFloat(airport[2]) * (Math.PI / 180);
    let check_long = parseFloat(airport[3]) * (Math.PI / 180);

    let deltalat = lat - check_lat;
    let deltalong = long - check_long;

    let d =
      2 *
      3959 *
      Math.asin(
        Math.sqrt(
          Math.pow(Math.sin(deltalat / 2), 2) +
            Math.cos(lat) *
              Math.cos(check_lat) *
              Math.pow(Math.sin(deltalong / 2), 2),
        ),
      );

    airport[4] = d;
  }
  console.log(parsed.data[0]);

  const nearest = parsed.data.reduce((best, cur) =>
    cur[4] < best[4] ? cur : best,
  );

  console.log(nearest[0]);

  let response = await fetch(
    `https://sounds.liamfissell.com/api/secret/${nearest[0]}`,
  );
  let data = await response.json();

  if (await data.today.error) {
    loading.textContent = `${await data.tomorrow.best_flights[0].flights[0].flight_number} arrives tomorrow ${await data.tomorrow.best_flights[0].flights[0].arrival_airport.time.split(" ")[1]}`;
  } else {
    loading.textContent = `${await data.today.best_flights[0].flights[0].flight_number} arrives today ${await data.today.best_flights[0].flights[0].arrival_airport.time.split(" ")[1]}`;
  }
}

async function main() {
  function errorCallback(position) {
    console.log(`error ${position.code}: ${position.message}`);
  }

  if ("geolocation" in navigator) {
    const options = {
      enableHighAccuracy: false, // Forces GPS use if available
      timeout: 5000, // Time in ms before throwing an error
      maximumAge: 600000,
    };

    // 2. Request the current position
    navigator.geolocation.getCurrentPosition(populate, errorCallback, options);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

main();
