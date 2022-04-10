const express = require("express");
const logger = require("morgan");
const mongoClient = require("mongoose");

require("dotenv").config();

const userRoute = require("./routes/user");
const deckRoute = require("./routes/deck");

const app = express();

app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());

// setup connect mongodb
mongoClient
    .connect("mongodb://localhost/nodejsapistarter")
    .then(() => {
        console.log("connect database success");
    })
    .catch((error) => {
        console.error("connect database error");
    });

// middlewares
app.use(logger("dev"));

// routes
app.use("/users", userRoute);
app.use("/decks", deckRoute);

// routes
app.get("/", (req, res, next) => {
    return res.status(200).json({
        message: "Server is OK!",
    });
});

// catch 404 errors
app.use((req, res, next) => {
    const err = new Error("Not Found!");
    err.status = 404;
    next(err);
});

// error handler function
app.use((err, req, res, next) => {
    const error = app.get("env") === "development" ? err : {};
    const status = err.status || 500;

    // response to client
    return res.status(status).json({
        error: {
            message: error.message,
        },
    });
});

// start the server
const port = 8080;
app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}`);
});
