const restaurant = (db) => {


 /*
    make a query and get all the tables in database
 */
    async function getTables() {
        // get all the available tables
        let allTables = await db.any("SELECT * FROM table_booking ORDER BY id ASC");
        return allTables;
    }

     /*
        check if the passed table is valid or not
        return true or false
     */
    function checkAvailTables(tables, requested) {
        let tablesArr = [];

        for (let i of tables) {
            tablesArr.push(i.table_name);
        }
        return tablesArr.includes(requested);
    }



    /*
        If phone number = true
        if username =true
        if seats = true
        if capacity is more than or equal seats
        then
        add a booking
        -- else return an error stating the problem
    */
    async function bookTable(tableName) {
        // book a table by name
        const allTables = await db.manyOrNone("SELECT table_name FROM table_booking");
        const requestedTable = await db.oneOrNone("SELECT * FROM table_booking WHERE table_name = $1", [tableName.tableName]);
        if (checkAvailTables(allTables, tableName.tableName)) {
            if (tableName.username) {
                if (tableName.phoneNumber) {
                    if(tableName.seats){
                        if (requestedTable.capacity >= tableName.seats) {
                            const updateQuery = `UPDATE table_booking SET booked = $1,
                                username = $2, 
                                number_of_people = $3,
                                contact_number = $4 
                                WHERE table_name = $5`;
                            await db.any(updateQuery, [true, tableName.username.toLowerCase(), tableName.seats, parseInt(tableName.phoneNumber.replace(/\D/g, ""), 10), tableName.tableName]);
                            return {bool:true, message:"Successfully placed a booking"};
                        } else {
                            return "capacity greater than the table seats";
                        }
                    }else{
                        return "Please insert size number"
                    }
                } else {
                    return "Please enter a contact number";
                }
            } else {
                return "Please enter a username";
            }
        } else {
            return "Invalid table name provided";
        }
    }

    /*
    return all the tables where booked is true
    */
    async function getBookedTables() {
        let allBookedTables = await db.manyOrNone("SELECT * FROM table_booking WHERE booked=true");
        return allBookedTables;
    }


     /*
        Get table from database
        if booked is true then return true
        if booked is false then return fals
    */
    async function isTableBooked(tableName) {
        let tableStatus = await db.oneOrNone("SELECT booked FROM table_booking WHERE table_name = $1", [tableName]);
        return tableStatus.booked;
    }

     /*
        Reset all the values for the provided table name
    */
    async function cancelTableBooking(tableName) {
        // cancel a table by name
        await db.any("UPDATE table_booking SET booked = $1, username = $2, number_of_people = $3,contact_number = $4 WHERE table_name=$5", [false, "", null, null, tableName]);
    }


     /*
        get all the tables for the provided username
     */
    async function getBookedTablesForUser(username) {
        const bookedTablesForUser = await db.manyOrNone("SELECT * FROM table_booking WHERE username = $1 ORDER BY id ASC", [username.toLowerCase()]);
        return bookedTablesForUser;
    }

    return {
        getTables,
        bookTable,
        getBookedTables,
        isTableBooked,
        cancelTableBooking,
        getBookedTablesForUser,
        // editTableBooking,
    };
};

export default restaurant;
