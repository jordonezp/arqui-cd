const Queue = require('bull');

const eventQueue = new Queue('calculating difficulty', { 
  redis: { 
    port: process.env.REDIS_PORT, 
    host: process.env.REDIS_HOST, 
    password: process.env.REDIS_PASSWORD, 
  },
}); // Specify Redis connection using object

const seconds = 2 * 1000;
let i = 0;

// setInterval( () => {
//   eventQueue.add({ evento: `evento${i}` });
//   console.log(`Adding Task ${i}`);
//   i++;
// }, seconds);

const express = require('express')
var os = require("os")
const port = process.env.PRODUCER_PORT || 3001
const bodyParser = require('body-parser')
app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/hola', (req, res) => {
  res.send('hola mundo')
})

app.get('/job/:id', async (req, res) => {
  job = await eventQueue.getJob(parseInt(req.params.id))
  if (job) {
    const body = await(job.getState());
    res.send(JSON.stringify(body));
  } else {
    res.send(JSON.stringify('Not such id'));
  }
})

app.post('/job', (req, res) => {
  eventQueue.add({ userId: req.body.userId, messageId: req.body.messageId });
  // eventQueue.add({ userId: 1, messageId: 1 });
  res.send(true);
})

app.get('/heartbeat', (req, res) => {
  res.send(true)
})

app.listen(port, () => {
  console.log(`api corriendo ${port}`)
})


console.log(os.hostname())