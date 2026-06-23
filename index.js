async function main() {
  const loading = document.getElementsByTagName("p")[0];
  console.log(loading);

  let now = new Date();
  console.log(now);
  let response = await fetch(
    `https://serpapi.com/search.json?engine=google_flights&type=2&departure_id=BNA&arrival_id=BWI&outbound_date=${now.toLocaleDateString("en-CA")}&hl=en&api_key=e3bd532f4329b16103190ef6f3ac8cbe9b07eb591074fca3b9593208496cea39`,
  );

  let data = await response.json();

  console.log(await data);

  if (await data.error) {
    now.setDate(now.getDate() + 1);
    let response = await fetch(
      `https://serpapi.com/search.json?engine=google_flights&type=2&departure_id=BNA&arrival_id=BWI&outbound_date=${now.toLocaleDateString("en-CA")}&hl=en&api_key=e3bd532f4329b16103190ef6f3ac8cbe9b07eb591074fca3b9593208496cea39`,
    );

    let data = await response.json();
    console.log(await data);

    loading.textContent = `${await data.best_flights[0].flights[0].flight_number} arrives tomorrow ${await data.best_flights[0].flights[0].arrival_airport.time.split(" ")[1]}`;
  } else {
    loading.textContent = `${await data.best_flights[0].flights[0].flight_number} arrives today ${await data.best_flights[0].flights[0].arrival_airport.time.split(" ")[1]}`;
  }
}

main();
