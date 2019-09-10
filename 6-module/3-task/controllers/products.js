const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const query = ctx.query.query ? ctx.query.query : null;
  ctx.body = {products: await Product.find({$text: {$search: query}})};
};
