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
    console.log(process.env.FRONTEND_URL);
  })
  .catch(() => console.log("Can not connect to the Database ! "));

const port = process.env.PORT;
app.listen(port, "0.0.0.0", () => {
  console.log("Server start listening...");
});
