const Product = require('../models/Product');
const mongoose = require('mongoose');

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.params.id;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const productData = await Product.findOne({'_id': ctx.params.id});
    if (productData === null) {
      ctx.res.statusCode = 404;
    } else {
      ctx.body = {product: productData};
    }
  } else {
    ctx.res.statusCode = 400;
  }
};

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const subcategoryId = ctx.query.subcategory ? ctx.query.subcategory : null;
  if (subcategoryId === null) {
    next();
  } else {
    if (mongoose.Types.ObjectId.isValid(subcategoryId)) {
      ctx.body = {products: await Product.find({'subcategory': {'_id': subcategoryId}})};
    } else {
      ctx.body = {products: []};
    }
  }
};

module.exports.productList = async function productList(ctx, next) {
  ctx.body = {products: await Product.find({})};
};