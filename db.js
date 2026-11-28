const mongoose = require("mongoose");

const databaseurl = process.env.databaseurl;

mongoose.connect(databaseurl).then(() => console.log("database connection established")).catch((err) => ("Unable to connect to db due to " + err));