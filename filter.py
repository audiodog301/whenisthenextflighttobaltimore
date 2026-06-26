import csv

with open("airports.csv") as f, open("airports_small.csv", "w", newline="") as out:
    reader = csv.DictReader(f)
    cols = ["iata_code", "name", "latitude_deg", "longitude_deg"]
    writer = csv.DictWriter(out, fieldnames=cols, extrasaction="ignore")
    writer.writeheader()
    for row in reader:
        if row["iata_code"] and row["scheduled_service"] == "yes":
            writer.writerow(row)