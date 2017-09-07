# CSV File validator

## What is this app?
This is a small app written in Node.JS to validate the CSV file and convert the validated data to JSON, XML and CSV file.

## What all are covered?
The app validates the csv with following format
```
"name","address","stars","contact","phone","uri"
"The Gibson","63847 Lowe Knoll, East Maxine, WA 97030-4876",5,"Dr. Sinda Wyman","+1 270-665-9933 ext. 1626","http://www.paucek.com/search.htm"
"Martini Cattaneo","Stretto Bernardi 004, Quarto Mietta nell'emilia, 07958 Torino (OG)",5,"Rosalino Marchetti","+39 62768225719","http://www.farina.org/blog/categories/tags/about.html"
"Apartment Dörr","Bolzmannweg 451, 05116 Hannover",1,"Scarlet Kusch-Linke","+1 08177354570","http://www.garden.com/list/home.html"
"Henck Schleich","Jesselstraße 31, 82544 Rochlitz",1,"Klarissa Etzold","+1 098-915-8482","http://reichmann.de/main/"
"The Rolland","56, chemin de Bertin, 02035 Gros",5,"Paulette Maury","+33 1 39 31 91 77","http://www.rousseau.fr/"
```

Following validations are present
- Convert name column to utf-8 encoding.
- Convert phone number to international format.
- Remove if there is any negative numbers in the stars field.

## Output
The app produces 3 outputs, links will be present on the app page after successful execution.

## Running the app
The app works on **node v6.10.0**.
After cloning the repository run
```
npm install
```
and then
```
node app
```
to run the application.
You can use the application by opening URL: `http://localhost:4000/` in browser.

## Author
Alfred Paul (alfredpp@gmail.com)

