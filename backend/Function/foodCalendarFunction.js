const { Category,Food,Calendar } = require("../db/dbSchema");
const catchAsync = require("./utils/catchAsync");
const factory = require("./handleFunction");
const APIFeatures = require("./utils/APIFeatures");

exports.createCategory = catchAsync(async(req,res,next) => {

    const newCategory = await Category.create(req.body);

    res.status(201).json({
        status:'success',
        message:`category '${req.body.name}' created successfully`,
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

    const newFood = await Food.create({category_id:req.params.id,...req.body});
    
    res.status(201).json({
        status:'success',
        message:`food '${req.body.name}'created successfully`,
        foodId: newFood.id
    });
});

exports.getFoods = catchAsync(async(req,res,next) => {
    const features = new APIFeatures(Food.find(), req.query)
    .filter()

    const food = await features.query;
    
    res.status(200).json({
        status: "success",
        result:food.length,
        data:{food}
    })
});

exports.deleteFood = factory.deleteOne(Food);

exports.getFoodsDB = catchAsync(async(req,res,next) => {

    const FoodsDB = await Category.find().populate({
        path: 'foods',
        select: 'name likes dislikes -category_id '}) 

    res.status(200).json({
        status: "success",
        data:{FoodsDB}
    })
});

exports.createDate = catchAsync(async(req,res,next) => {
    const newDate = await Calendar.create(req.body);

    res.status(201).json({
        status:'success',
        message:`The date created successfully`,
        dateId: newDate.id
    });
});

exports.getDates = catchAsync(async(req,res,next) => {
    const features = new APIFeatures(Calendar.find(), req.query)
    .filter()
    .sort();
    
    const date = await features.query.populate({
        path: 'foods',
        select: 'name likes dislikes category_id '}) ;

    res.status(200).json({
        status: "success",
        result:date.length,
        data:{date}
    })
});

exports.updateDate = factory.editOne(Calendar);

exports.delDates = catchAsync(async(req,res,next) => {
    
    const queryObj = req.query
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|e|lt|lte)\b/g,
      (match) => "$" + match
    );

    await Calendar.deleteMany(JSON.parse(queryStr));

    res.status(204).json({
        status: "success",
        data:null
      });
});