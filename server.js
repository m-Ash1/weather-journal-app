// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static("website"));

// Setup Server
app.get("/data/get", (_req, res) => {
  res.send(projectData);
});

app.post("/data/send", (req, res) => {
  projectData = req.body;
  res.send(projectData);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
