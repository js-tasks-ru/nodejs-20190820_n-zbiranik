const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  const orderData = ctx.request.body;
  orderData.user = ctx.user;

  const order = new Order(orderData);

  await order.save().then(() => {
    sendMail({
      template: 'order-confirmation',
      locals: {id: order._id, product: order.product},
      to: ctx.user.email,
      subject: 'Новый заказ',
    });
    ctx.status = 200;
    ctx.body = {order: order._id};
  });
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  ctx.status = 200;
  ctx.body = {orders: await Order.find({user: ctx.user})};
};
