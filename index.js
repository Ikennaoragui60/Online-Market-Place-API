const express = require("express");
const mongoose = require("./db");
const PORT = 2027

const app = express();
app.use(express.json());
app.use("/api/customers", require("./Routes/customerRoutes"))
app.use("/api/products", require("./Routes/productRoutes"))
app.use("/api/orders", require("./Routes/orderRoutes"))

app.get("/", (req, res) => res.send("Online Market Place API is running"))

app.listen(PORT, () => { console.log(`My app is running on port ${PORT}`) });

