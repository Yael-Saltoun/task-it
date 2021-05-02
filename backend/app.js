const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const tasksRoutes = require("./routes/tasks");
const userRoutes = require("./routes/user");

const app = express();

mongoose.connect("mongodb+srv://taskDev:IX0dCBzVjXy74VhH@cluster0.qwkh9.mongodb.net/node-angular?retryWrites=true&w=majority",
 {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
  console.log('connected to DB');
})
.catch(() => {
  console.log('connection failed');
});

//mongoDB
//taskDev
//IX0dCBzVjXy74VhH password

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
   "Origin, X-Request-With, Content-Type, Accept, Authorization"
  );
  console
  res.setHeader("Access-Control-Allow-Methods",
  "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
 next();
});

app.use("/api/tasks", tasksRoutes);
app.use("/api/user", userRoutes);


module.exports = app;
