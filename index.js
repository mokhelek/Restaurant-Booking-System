import express from "express";
// import pgp from "pg-promise";
import exphbs from "express-handlebars";
import bodyParser from "body-parser";
import flash from "flash-express";


const app = express()

import pgPromise from "pg-promise";
import 'dotenv/config';
const connection = process.env.DATABASE_URL;
const db = pgPromise()(connection);
db.connect();



app.use(express.static('public'));
app.use(flash());

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

app.post("/book", async (req, res) => {
    // const tables = await restaurantTableBooking.getTables()
    let bookingDetails = {
        tableName: req.body.tableId,
        username: req.body.username,
        phoneNumber: req.body.phone_number ,
        seats: Number(req.body.booking_size)
    }
    await restaurantTableBooking.bookTable(bookingDetails);

    res.redirect("/")
});

app.get("/bookings", (req, res) => {
    res.render('bookings', { tables : [{}, {}, {}, {}, {}, {}]})
});


var portNumber = process.env.PORT || 3000;

//start everything up
app.listen(portNumber, function () {
    console.log('🚀  server listening on:', portNumber);
});