const express = require("express"); // Import Express
const path = require("path"); // Import path module
const mongoose = require("mongoose");
const app = express(); // Create an Express app
const port = process.env.PORT || 3000; // Set server port

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Route for '/' serving the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route for '/portal' serving the public\portal\index.html file
app.get("/portal", (req, res) => {
  res.sendFile(path.join(__dirname, "public/portal", "index.html"));
});

// Route for '/byeblock' serving the Byeblocker.html file
app.get("/byeblock", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Byeblocker.html"));
});

// Route for '/fart' serving the Fart.html file
app.get("/fart", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Fart.html"));
});

// Route for '/list' serving the list.html file
app.get("/list", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "list.html"));
});

// Route for '/game' serving the games.html file
app.get("/games", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "games.html"));
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

// Connecting to local MongoDB
mongoose.connect("mongodb://localhost:27017/visitCounterDB", {
  useNewUrlParser: true,
});

// Creating visitor Schema to hold the
// count of visitors
const visitorSchema = new mongoose.Schema({
  name: String,
  count: Number,
});

// Creating Visitor Table in visitCounterDB
const Visitor = mongoose.model("Visitor", visitorSchema);

// Get request to app root
app.get("/", async function (req, res) {
  // Storing the records from the Visitor table
  let visitors = await Visitor.findOne({ name: "localhost" });

  // If the app is being visited first
  // time, so no records
  if (visitors == null) {
    // Creating a new default record
    const beginCount = new Visitor({
      name: "localhost",
      count: 1,
    });

    // Saving in the database
    beginCount.save();

    // Sending the count of visitor to the browser
    res.send(`<h2>Counter: ` + 1 + "</h2>");

    // Logging when the app is visited first time
    console.log("First visitor arrived");
  } else {
    // Incrementing the count of visitor by 1
    visitors.count += 1;

    // Saving to the database
    visitors.save();

    // Sending the count of visitor to the browser
    res.send(`<h2>Counter: ` + visitors.count + "</h2>");

    // Logging the visitor count in the console
    console.log("visitor arrived: ", visitors.count);
  }
});

// Creating server to listen at localhost 3000
app.listen(3000, function (req, res) {
  // Logging when the server has started
  console.log("listening to server 3000");
});

// Start the server
app.listen(port, () => {
  console.log(`app listening on port ${port} at localhost:${port}`);
});
