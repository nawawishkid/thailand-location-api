# Thailand location API

Location information from [BOT](https://www.bot.or.th/Thai/Statistics/DataManagementSystem/TempClose/FI_FM1/Code/DocLib_StandardCodeMapping/Location_Postal%20Code.xls)

## Disclaimer!

This repo has no database schema definition. It just connects with MySQL database named `location_th` and `SELECT * FROM location WHERE zipcode = ?`. You have to create a database and import the [.csv](./data/thailand_location_code.csv) file or the [.sql](./data/location_th.sql) file into it.

## Endpoints

Currently querying with zipcode is the only way to get location info

`GET /locations?zipcode={zipcode}`
