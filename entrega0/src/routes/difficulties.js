
const KoaRouter = require('koa-router');

const router = new KoaRouter();
const { fetchGetHeartbeat, fetchGetJob, fetchPostJob} = require( '../middlewares/getinfo');

router.get('difficulties.show','/show', async(ctx) => {
   console.log("entre");
   
   console.log(`body: ${ctx.request.query.userId}`);
   //const body = ctx.request.query;
   const response = await ctx.orm.difficulty.findOne({ where: { userId: ctx.request.query.userId, messageId: ctx.request.query.messageId} });
   ctx.status = 200;
   ctx.body = response;
  });
router.get('difficulties.get', '/', async(ctx) =>{
  try{
    const response = await fetchGetHeartbeat();
    console.log('en heartbeat');
    ctx.body = response;
    ctx.status = 201;
  } catch (error) {
    ctx.status = 400;
  }
});

// El request body es de esta forma: { userId: 1, messageId: 2 }
// Para probar esto hay que correr (si no se migró difficulties antes): docker compose run app yarn sequelize db:migrate
router.post('difficulties', '/', async(ctx) =>{
  try{
    const body = JSON.stringify(ctx.request.body);
    await fetchPostJob(body);
    ctx.status = 201;
  } catch (error) {
    ctx.status = 400;
  }
});

// PROBAR
router.get('difficulties.job', '/:id', async(ctx) =>{
  const jobId = ctx.params.id;
  try{
    const response = await fetchGetJob(jobId);
    ctx.body = response;
    ctx.status = 201;
  } catch (error) {
    ctx.status = 400;
  }
});

module.exports = router;
