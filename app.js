require("dotenv").config();
const express = require("express");
const app = express();
const routes = require("./routes");
const { default: mongoose } = require("mongoose");
// create server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
//app.use(cors());
app.use(express.json());
app.use(routes);
app.use((error, req, res, next) => {
  res.status(500).json({ error: error.message });
});
// connect database
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Database connected successfully.."))
  .catch(console.log);
module.exports = app;