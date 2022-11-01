require('dotenv').config();

const KoaRouter = require('koa-router');
const jwt = require('koa-jwt');

const users = require('./routes/users');
// const waitingRooms = require('./routes/waitingRooms');
const session = require('./routes/session');
const messages = require('./routes/messages');
const index = require('./routes/index');
const difficulties = require('./routes/difficulties');
// const { isAuthenticated } = require('./middlewares/auth');

const router = new KoaRouter();

// Revisa si hay un usuario loggeado
router.use(async (ctx, next) => {
  if (ctx.session.currentUserId) {
    // console.log('HAYYY USER');
    ctx.state.currentUser = await ctx.orm.user.findByPk(ctx.session.currentUserId);
  }
  await next();
});

router.use(async (ctx, next) => {
  Object.assign(ctx.state, {
    paths: {
      destroySession: ctx.router.url('session.destroy'),
      newSession: ctx.router.url('session.new'),
      newUser: ctx.router.url('users.new'),
    },
  });
  return next();
});

// router.use(jwt({ secret: process.env.JWT_SECRET, key: 'authData', passthrough: true }));
router.use('/', index.routes());
router.use('/messages', messages.routes());
router.use('/users', users.routes());
router.use('/session', session.routes());
router.use('/difficulties', difficulties.routes());

// router.use(isAuthenticated);
// router.use('/waitingRooms', waitingRooms.routes());

module.exports = router;
