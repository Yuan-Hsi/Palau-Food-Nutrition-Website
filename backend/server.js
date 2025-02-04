const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./config.env" });

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("successfully connect!");
  })
  .catch(() => console.log("Can not connect to the Database ! "));

const port = process.env.PORT;
app.listen(port, () => {
  console.log("Server start listening...");
});
