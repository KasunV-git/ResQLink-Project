const express = require("express");
const sequelize = require("./database/connection");

const app = express();

sequelize
    .authenticate()
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.error("Database connection failed:", err.message);
    });

app.listen(5000, () => {
    console.log("Server running on port 5000");
});