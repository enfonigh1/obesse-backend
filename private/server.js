const express = require('express');
const cors = require('cors');
require('dotenv').config();
const keys = require("./keys.json");

// Initialize express app
const app = express();

// Set database name
app.set("keys", keys.obesse);

// Set port
const PORT = process.env.PORT || 3001;

// Set body parser
app.use(express.json());


// Set cors
app.use(cors())

// Set routes
require("./database/database")(app.get("keys").db_name);

// use routes
app.use("/api/v1", require("./routes/v1/routes"));


// Listen to port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});