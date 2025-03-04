const express = require("express");
const foodCalendar = require("../Function/foodCalendarFunction");
const {
  protect: loginRequire,
  restrictTo,
} = require("../Function/authorizingFunction");

const foodCalendarRouter = express.Router();

foodCalendarRouter
  .route("/category")
  .post(loginRequire, restrictTo("admin"), foodCalendar.createCategory)
  .get(foodCalendar.getCategories);

foodCalendarRouter
.route("/category/:id")
.delete(loginRequire, restrictTo("admin"), foodCalendar.createCategory)

foodCalendarRouter
  .route("/foods")
  .post(loginRequire, restrictTo("admin"), foodCalendar.createFood)

foodCalendarRouter
.route("/foods/:id")
.get(foodCalendar.getFoods) // the id here is the categoryID
.delete(loginRequire, restrictTo("admin"), foodCalendar.deleteFood)  // the id here is the foodID


foodCalendarRouter
  .route("/")
  .post(loginRequire, restrictTo("admin"), foodCalendar.createDate)
  .get(foodCalendar.getDates);

foodCalendarRouter
.route("/:id")
.put(loginRequire, restrictTo("admin"), foodCalendar.updateDate)

module.exports = foodCalendarRouter;
