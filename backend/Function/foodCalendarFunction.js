const { Category,Food,Calendar } = require("../db/dbSchema");
const catchAsync = require("./utils/catchAsync");
const factory = require("./handleFunction");

exports.createCategory = catchAsync(async(req,res,next) => {

    const newCategory = await Category.create(req.body);

    res.status(201).json({
        status:'success',
        message:`category '${req.body.name}'created successfully`,
        categoryId: newCategory.id
    });
});

exports.getCategories = catchAsync(async(req,res,next) => {
    const category = await Category.find();
    
    res.status(200).json({
        status: "success",
        result:category.length,
        data:{category}
    })
});

exports.deleteCategory = factory.deleteOne(Category);

exports.createFood = catchAsync(async(req,res,next) => {
    const newFood = await Food.create(req.body);

    res.status(201).json({
        status:'success',
        message:`food '${req.body.name}'created successfully`,
        foodId: newFood.id
    });
});

exports.getFoods = catchAsync(async(req,res,next) => {
    const food = await Food.find({category_id:req.params.id});
    
    res.status(200).json({
        status: "success",
        result:food.length,
        data:{food}
    })
});

exports.deleteFood = factory.deleteOne(Food);

exports.createDate = catchAsync(async(req,res,next) => {
    const newDate = await Calendar.create(req.body);

    res.status(201).json({
        status:'success',
        message:`The date created successfully`,
        dateId: newDate.id
    });
});

exports.getDates = catchAsync(async(req,res,next) => {
    const date = new APIFeatures(Calendar.find(), req.query)
    .filter()
    .sort();
    
    res.status(200).json({
        status: "success",
        result:date.length,
        data:{date}
    })
});

exports.updateDate = factory.editOne(Calendar);

