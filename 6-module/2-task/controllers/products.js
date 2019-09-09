const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  ctx.body = {products: []};
};

module.exports.productList = async function productList(ctx, next) {
  ctx.body = {products: await Product.find()};
};

module.exports.productById = async function productById(ctx, next) {
  ctx.body = {product: {}};
};

