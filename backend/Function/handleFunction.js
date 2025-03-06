const catchAsync = require("./utils/catchAsync");
const AppError = require("./utils/appError");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const del = await Model.findByIdAndDelete(req.params.id);
    
    if (!del) {
      throw new AppError(
        `Can not find the document with id: ${req.params.id}`,
        404
      );
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.editOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const update = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // 返回改後資料
      runValidators: true, // 會再跑一次 schema 確認
    });

    if (!update) {
      throw new AppError(
        `Can not find the id: ${req.params.id}`,
        404
      );
    }

    res.status(200).json({
      status: "success",
      update,
    });
  });
