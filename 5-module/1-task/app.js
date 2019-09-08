const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const subscribers = [];

router.get('/subscribe', async (ctx, next) => {
  const message = await new Promise((resolve, reject) => {
    subscribers.push(resolve);
  });
  ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;
  if (typeof(message) !== 'undefined' && message.trim() !== '') {
    subscribers.forEach(resolve => {
      resolve(message);
    });
  }
  ctx.res.statusCode = 200;
});

app.use(router.routes());

module.exports = app;
