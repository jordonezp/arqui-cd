const KoaRouter = require('koa-router');

const router = new KoaRouter();

// http://localhost:3000/users/ (se agrega un usuario)
router.post('/', async (ctx) => {
  const message = ctx.orm.message.build(ctx.request.body);
  try {
    await message.save({ fields: ['type', 'lat', 'lon', 'location', 'message', 'level'] });
    ctx.body = message;
    ctx.status = 201;
  } catch (error) {
    // const errorMessage = error.errors.map((e) => e.message);
    // ctx.body = errorMessage;
    ctx.status = 400;
  }
});

// Metodo GET: para lista de mensajes
router.get('messages.list', '/list', async (ctx) => {
  const message = await ctx.orm.message.findAll();
  try{
    message.reverse();
    ctx.body = message;
    ctx.status = 200;
  } catch (error) {
    ctx.status = 400;
  }
 
  // var user_logged = false;
  // if (ctx.session.currentUserId) {
  //   user_logged = true;
  // }
  // await ctx.render('message/index', {
  //   message,
  //   user_logged,
  //   // destroySessionPath: ctx.router.url('session.destroy'),
  // });
  
});

module.exports = router;
