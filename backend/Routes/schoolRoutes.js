const express = require("express");
const schoolFunction = require("../Function/schoolFunction");
const { protect: loginRequire, restrictTo } = require("../Function/authorizingFunction");

const schoolRouter = express.Router();

// prettier-ignore
schoolRouter.route("/")
.post(loginRequire, restrictTo("admin"), schoolFunction.createSchool)
.get(schoolFunction.getSchoolsPublic);

// prettier-ignore
schoolRouter.route("/private")
.get(loginRequire, restrictTo("admin"), schoolFunction.getSchoolsPrivate);

// prettier-ignore
schoolRouter
.route("/:id")
.put(loginRequire, restrictTo("admin"), schoolFunction.updateSchool)
.delete(loginRequire, restrictTo("admin"), schoolFunction.deleteSchool)

// prettier-ignore
schoolRouter
.route("/cook/:id")
.patch(loginRequire, restrictTo("admin"), schoolFunction.addACook)
.delete(loginRequire, restrictTo("admin"), schoolFunction.removeACook)

module.exports = schoolRouter;
