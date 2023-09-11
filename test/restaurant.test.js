import assert from "assert";
import RestaurantTableBooking from "../services/restaurant.js";

import "dotenv/config";
import pgPromise from "pg-promise";

const connection = process.env.DATABASE_URL_TEST;
const db = pgPromise()(connection);
db.connect();

// const restaurantTableBookingInstance = RestaurantTableBooking(db)

describe("The restaurant booking table", function () {
    this.timeout(10000);
    beforeEach(async function () {
        try {
            await db.any("UPDATE table_booking SET booked = $1, username = $2, number_of_people = $3,contact_number = $4 ", [false, "", null, null]);
        } catch (err) {
            console.log(err);
            throw err;
        }
    });

    it("Get all the available tables", async function () {
        const restaurantTableBooking = await RestaurantTableBooking(db);

        const expectedOutput = [
            {
                id: 1,
                table_name: "Table one",
                capacity: 4,
                booked: false,
                username: "",
                number_of_people: null,
                contact_number: null,
            },
            {
                id: 2,
                table_name: "Table two",
                capacity: 6,
                booked: false,
                username: "",
                number_of_people: null,
                contact_number: null,
            },
            {
                id: 3,
                table_name: "Table three",
                capacity: 4,
                booked: false,
                username: "",
                number_of_people: null,
                contact_number: null,
            },
            {
                id: 4,
                table_name: "Table four",
                capacity: 2,
                booked: false,
                username: "",
                number_of_people: null,
                contact_number: null,
            },
            {
                id: 5,
                table_name: "Table five",
                capacity: 6,
                booked: false,
                username: "",
                number_of_people: null,
                contact_number: null,
            },
            {
                id: 6,
                table_name: "Table six",
                capacity: 4,
                booked: false,
                username: "",
                number_of_people: null,
                contact_number: null,
            },
        ];

        assert.deepEqual(expectedOutput, await restaurantTableBooking.getTables());
    });

    it("It should check if the capacity is not greater than the available seats.", async function () {
        const restaurantTableBooking = await RestaurantTableBooking(db);

        const result = await restaurantTableBooking.bookTable({
            tableName: "Table four",
            username: "Kim",
            phoneNumber: "084 009 8910",
            seats: 3,
        });

        assert.equal("capacity greater than the table seats", result);
    });

    // it("should check if there are available seats for a booking.", async function () {
    //     const restaurantTableBooking = await RestaurantTableBooking(db);

    //     // get all the tables

    //     // loop over the tables and see if there is a table that is not booked

    //     assert.deepEqual(true, false);
    // });

    it("Check if the booking has a user name provided.", async function () {
        const restaurantTableBooking = await RestaurantTableBooking(db);
        assert.deepEqual(
            "Please enter a username",
            await restaurantTableBooking.bookTable({
                tableName: "Table two",
                phoneNumber: "084 009 8910",
                seats: 2,
            })
        );
    });

    it("Check if the booking has a contact number provided.", async function () {
        const restaurantTableBooking = await RestaurantTableBooking(db);
        assert.deepEqual(
            "Please enter a contact number",
            await restaurantTableBooking.bookTable({
                tableName: "Table two",
                username: "Kim",
                seats: 2,
            })
        );
    });

    it("should not be able to book a table with an invalid table name.", async function () {
        const restaurantTableBooking = await RestaurantTableBooking(db);

        const message = await restaurantTableBooking.bookTable({
            tableName: "Table eight",
            username: "Kim",
            phoneNumber: "084 009 8910",
            seats: 2,
        });

        assert.deepEqual("Invalid table name provided", message);
    });

    it("should be able to book a table.", async function () {
        let restaurantTableBooking = RestaurantTableBooking(db);
        //Table three should not be booked
        assert.equal(false, await restaurantTableBooking.isTableBooked("Table three"));
        //book Table three

        await restaurantTableBooking.bookTable({
            tableName: "Table three",
            username: "Kim",
            phoneNumber: "084 009 8910",
            seats: 2,
        });

        // Table three should be booked now
        const booked = await restaurantTableBooking.isTableBooked("Table three");

        assert.equal(true, booked);
    });

    it("should list all booked tables.", async function () {
        let restaurantTableBooking = RestaurantTableBooking(db);
        let tables = await restaurantTableBooking.getTables();
        assert.deepEqual(6, tables.length);
    });

    it("should allow users to book tables", async function () {
        let restaurantTableBooking = await RestaurantTableBooking(db);

        assert.deepEqual([], await restaurantTableBooking.getBookedTablesForUser("jodie"));

        await restaurantTableBooking.bookTable({
            tableName: "Table five",
            username: "Jodie",
            phoneNumber: "084 009 8910",
            seats: 4,
        });

        await restaurantTableBooking.bookTable({
            tableName: "Table four",
            username: "Jodie",
            phoneNumber: "084 009 8910",
            seats: 2,
        });

        await restaurantTableBooking.bookTable({
            tableName: "Table five",
            username: "Jodie",
            phoneNumber: "084 009 8910",
            seats: 4,
        });

        // should only return 2 bookings as two of the bookings were for the same table
        let expectedOutput = [
            {
              booked: true,
              capacity: 2,
              contact_number: 840098910,
              id: 4,
              number_of_people: 2,
              table_name: 'Table four',
              username: 'jodie'
            },
            {
              booked: true,
              capacity: 6,
              contact_number: 840098910,
              id: 5,
              number_of_people: 4,
              table_name: 'Table five',
              username: 'jodie'
            }
          ]
          
        assert.deepEqual(expectedOutput, await restaurantTableBooking.getBookedTablesForUser("jodie"));
    });

    it("should be able to cancel a table booking", async function () {
        let restaurantTableBooking = await RestaurantTableBooking(db);

        await restaurantTableBooking.bookTable({
            tableName: "Table five",
            username: "Jodie",
            phoneNumber: "084 009 8910",
            seats: 4,
        });

        restaurantTableBooking.bookTable({
            tableName: "Table four",
            username: "Kim",
            phoneNumber: "084 009 8910",
            seats: 2,
        });

        let bookedTables = await restaurantTableBooking.getBookedTables();
        assert.equal(2, bookedTables.length);

        await restaurantTableBooking.cancelTableBooking("Table four");

        bookedTables = await restaurantTableBooking.getBookedTables();
        assert.equal(1, bookedTables.length);
    });

    after(function () {
        db.$pool.end;
    });
});
