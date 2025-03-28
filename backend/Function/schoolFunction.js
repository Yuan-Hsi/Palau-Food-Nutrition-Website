const { School } = require("../db/dbSchema");
const catchAsync = require("./utils/catchAsync");
const factory = require("./handleFunction");
const AppError = require("./utils/appError");
const APIFeatures = require("./utils/APIFeatures");

exports.createSchool = catchAsync(async (req, res, next) => {
  const newSchool = await School.create(req.body);

  res.status(201).json({
    status: "success",
    message: `school '${req.body.school}' created successfully`,
    schoolId: newSchool.id,
  });
});

exports.getSchoolsPublic = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(School.find().select("school"), req.query).filter().sort();

  const schools = await features.query;

  res.status(200).json({
    status: "success",
    result: schools.length,
    data: { schools },
  });
});

exports.getSchoolsPrivate = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(School.find().select("-__v"), req.query).filter().sort();

  const schools = await features.query;

  res.status(200).json({
    status: "success",
    result: schools.length,
    data: { schools },
  });
});

exports.updateSchool = catchAsync(async (req, res, next) => {
  if (req.body.cooker) {
    throw new AppError("If you want to change the cooker, please using the certain routes, not this!, 400");
  }

  const update = await School.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // 返回改後資料
    runValidators: true, // 會再跑一次 schema 確認
  });

  if (!update) {
    throw new AppError(`Can not find the id: ${req.params.id}`, 404);
  }

  res.status(200).json({
    status: "success",
    update,
  });
});

// prettier-ignore
exports.addACooker = catchAsync(async (req, res, next) => {
  
  const school = await School.findById(req.params.id);
  const oldCooker = school.cooker;
  if (oldCooker.includes(req.body.cooker)) {
    throw new AppError("This cooker is already in the list!", 400);
  }

  const newCooker = oldCooker.concat(req.body.cooker);
  const update = await School.findByIdAndUpdate(req.params.id, { cooker: newCooker }, {
    new: true, // 返回改後資料
    runValidators: true, // 會再跑一次 schema 確認
  });

  if (!update) {
    throw new AppError(`Can not find the id: ${req.params.id}`, 404);
  }

  res.status(200).json({
    status: "success",
    update,
  });
});

// prettier-ignore
exports.removeACooker = catchAsync(async (req, res, next) => {
  
  const school = await School.findById(req.params.id);
  const oldCooker = school.cooker;
  if (!oldCooker.includes(req.body.cooker)) {
    throw new AppError("This cooker is not in this school list!", 400);
  }

  const newCooker = oldCooker.filter(cooker => cooker !== req.body.cooker);
  const update = await School.findByIdAndUpdate(req.params.id, { cooker: newCooker }, {
    new: true, // 返回改後資料
    runValidators: true, // 會再跑一次 schema 確認
  });

  if (!update) {
    throw new AppError(`Can not find the id: ${req.params.id}`, 404);
  }

  res.status(200).json({
    status: "success",
    update,
  });
});

exports.deleteSchool = factory.deleteOne(School);
