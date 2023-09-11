const restaurant = (db) => {

    async function getTables() {
        // get all the available tables
        let allTables = await db.any("SELECT * FROM table_booking");
        return allTables;
    }

    async function bookTable(tableName) {
        // book a table by name
    }

    async function getBookedTables() {
        // get all the booked tables
    }

    async function isTableBooked(tableName) {
        // get booked table by name
    }

    async function cancelTableBooking(tableName) {
        // cancel a table by name
    }

    async function getBookedTablesForUser(username) {
        // get user table booking
    }

    return {
        getTables,
        bookTable,
        getBookedTables,
        isTableBooked,
        cancelTableBooking,
        getBookedTablesForUser
        // editTableBooking,
    }
}

export default restaurant;