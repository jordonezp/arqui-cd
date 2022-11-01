const KoaRouter = require('koa-router');
const { generateToken } = require('../middlewares/auth');

const router = new KoaRouter();

router.get('session.new', '/new', async (ctx) => {
  if (ctx.session.currentUserId) {
    await ctx.redirect(ctx.router.url('messages.list'));
  } else {
    await ctx.render('session/new', {
      submitPath: ctx.router.url('session.create'),
      usersPath: ctx.router.url('users.new'),
    });
  }
});

// endpoint para crear la sesión, login
router.post('session.create', '/', async (ctx) => {
  const { username, password } = ctx.request.body;
  const user = await ctx.orm.user.findOne({ where: { username } });
  if (!user) ctx.throw(404, `No user found with ${username}`);
  if (!password) ctx.throw(401, 'Your password is missing');
  // const authenticated = (user && password && user.password == password);
  const authenticated = await user.checkPassword(password);
  
  if (authenticated) {
    try {
      ctx.session.currentUserId = user.id;
      // const token = await generateToken(user);
      // ctx.body = {
      //   access_token: token,
      //   token_type: 'Bearer',
      // };
      const response_body = {id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, username: user.username, phoneNumber: user.phoneNumber  }
      ctx.status = 200;
      ctx.body = response_body;
    } catch (err) {
      ctx.body = err;
    }
  } else {
    const error = user ? 'Wrong password' : 'The username is not registered';
    ctx.body = error;
    ctx.status = 401;
  }
});

// endpoint para destruir la sesión, logout
router.get('session.destroy', '/destroy', async (ctx) => {
  if (ctx.session.currentUserId){
    ctx.session = null;
    ctx.status = 200;
    ctx.redirect(ctx.router.url('session.new'));
  }
  else {
    ctx.redirect(ctx.router.url('messages.list'));
  }
  
});
module.exports = router;
