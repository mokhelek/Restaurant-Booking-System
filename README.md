# Restaurant-Booking-System 

[![Node.js CI](https://github.com/mokhelek/Restaurant-Booking-System/actions/workflows/node.js.yml/badge.svg)](https://github.com/mokhelek/Restaurant-Booking-System/actions/workflows/node.js.yml)

**Scenario**: Restaurant Booking System Assessment

**Background:** You are tasked with creating a restaurant booking system for a popular restaurant chain called "Delicious Delights." The system will allow customers to make reservations for tables, and restaurant staff to see these reservations via an admin dashboard.

You need to:

* Fork and clone this repo.
* Use the supplied ExpressJS routes & SQL scripts.
     * Run `npm install` followed by `npm run dev` to get going.
     * The app will start on port `3000`.
     * Create PostgreSQL database and run the scripts in the `./sql` folder in the created database.
* Make the supplied Unit tests pass. 
     * Run - `npm test`
     * Just make the specified tests pass - there is no need to add more tests
* Implement the required functionality in the `restuarant.js` Factory Function file.
     * Once all the tests pass you should have everything you need for all the screens
     * **But** work using **thin slices** - once some tests pass implements the corresponding screens in `ExpressJS`. **Tip** get the `getTables` method working and implement the `/` route functionality first.
* Add the required routes in `index.js` - two routes are supplied `/` & `/bookings`.
* Add the other required routes & change the existing routes to use the Factory Function

## Requirements 

Routes   | HTTP Method | Description 
---|----|---
`/` | GET | Show tables that can be booked and allow client to book a tablle that is not already booked. Hide the radio button for table that are already booked.
`/book` | POST | Book a table that has not already been booked. If the number of customers is bigger than the table's capacity the table can't be booked. Show a flash error message in this scenario. Redirect back to the `/` route - with the required flash message.
`/bookings` | GET | Show all the bookings made
`/bookings/:username` | GET | Show all the bookings made by a given user. Allow booking cancellations
`/cancel` | POST | Cancel the booking booking for the selected table. Redirect back to the `/bookings` screen.

### For Customers 

`View Available Tables:`

Customers can view a list of available tables, including table size & availability status. Use the `/` route for this.

`Make a Reservation:`

Customers can select a table and make or cancel a reservation. They can see all the reservations they have made on the `/bookings/:username` route.

### For Admin:

`Dashboard Overview`

The admin dashboard provides an overview of all the restaurant's reservations and allow for cancellations. Find the dashboard at `/bookings`

## Database setup

When deploying create your database on [ElephantSQL](https://customer.elephantsql.com/login)

Deploy your webapp to [Render](https://render.com/).

Create an environment variable for your database connection string using `process.env.THE_VARIABLE_NAME_HERE`. 

Remember to set the environment variable this up in Render:

* Once you created a new `Web Service` in Render. 
* Go into the newly created Web Service. 
* Click on `Environment`, then add the required environment variable.

## GitHub actions                                            

Make sure your tests are running in `GitHub Actions`.

Use the supplied sql scripts in GitHub Actions like this:

```
 - name: create postgresql tables
      run: PGPASSWORD=coder123 psql -h localhost -U coder -d restuarant_bookings -a -f ./sql/tables.sql
 - name: populate data into table
      run: PGPASSWORD=coder123 psql -h localhost -U coder -d restuarant_bookings -a -f ./sql/data.sql
```

> **Note:** add your your own build steps in the yml `./github/workflows/node-deploy.yml/`. You can look at this [example](https://github.com/codex-academy/BasicExpressWebApp/blob/master/.github/workflows/node-pgsql.js.yml) from [crud.projectcodex.co](http://crud.projectcodex.co).

## Note

* Do some planning. Spend 30 minutes on planning & understanding the task at hand.
* Ask clarifying questions if needed.
* Create a Kanban board
* Share your application links in the feedback system. Watch out for the notification email.
* Please commit your final submission by **16h00**.
