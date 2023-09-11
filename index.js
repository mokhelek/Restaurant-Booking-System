import express from "express";
// import pgp from "pg-promise";
import exphbs from "express-handlebars";
import bodyParser from "body-parser";
// import flash from "flash-express";
import flash from "express-flash";
import session from "express-session";

const app = express()

import pgPromise from "pg-promise";
import 'dotenv/config';
const connection = process.env.DATABASE_URL;
const db = pgPromise()(connection);
db.connect();



app.use(
    session({
        secret: "<add a secret string here>",
        resave: false,
        saveUninitialized: true,
    })
);
app.use(flash());





app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const handlebarSetup = exphbs.engine({
    partialsDir: "./views/partials",
    viewPath: './views',
    layoutsDir: './views/layouts'
});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');


import restaurant from "./services/restaurant.js";

let restaurantTableBooking = restaurant(db)

app.get("/", async (req, res) => {
    const tables = await restaurantTableBooking.getTables()
    res.render('index', {tables})
});

// A route to place a table booking
//  get the data frm req.body
// call the  bookTable function 
// render flash messages for feedback
app.post("/book", async (req, res) => {
    // const tables = await restaurantTableBooking.getTables()
    let bookingDetails = {
        tableName: req.body.tableId,
        username: req.body.username,
        phoneNumber: req.body.phone_number ,
        seats: Number(req.body.booking_size)
    }
    let result = await restaurantTableBooking.bookTable(bookingDetails);
    if(result.bool){
        req.flash("success", result.message);
    }else{
        req.flash("error", result);
    }

    res.redirect("/")
});


//  A route to view all the booking
// call the getBookedTables functin and render to template
app.get("/bookings", async (req, res) => {
    let tables = await restaurantTableBooking.getBookedTables();
    res.render('bookings', {tables})
});


//  A route to get the bookings of a user
// call the bookedTablesFor User and render to template
app.get("/bookings/:username", async (req, res) => {
    let tables = await restaurantTableBooking.getBookedTablesForUser(req.params.username);
    res.render('bookings', {tables})
});

// A route to cancel a booking
// call the cancelBooking function and redirect
app.get("/cancel/:tableName", async (req, res) => {
    await restaurantTableBooking.cancelTableBooking(req.params.tableName);
    res.redirect("/bookings")
});



var portNumber = process.env.PORT || 3000;

//start everything up
app.listen(portNumber, function () {
    console.log('🚀  server listening on:', portNumber);
});