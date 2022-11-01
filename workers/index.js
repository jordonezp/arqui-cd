const Queue = require('bull');
const { Pool } = require("pg");
const NodeMailer = require("nodemailer");

const credentials = {
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
  // sender_email: process.env.EMAIL_SENDER,
  // sender_email_password: process.env.EMAIL_SENDER_PASSWORD,
};

// DB connection
const pool = new Pool(credentials);

// DB user query Function
function getUser(userId, pool) {
  try {
    const text = `
      SELECT * FROM users WHERE id=$1
    `;
    const values = [userId];
    return pool.query(text, values);
  } catch (error) {
    console.log(error);
  }
}

// Get a message from the DB with the given id
function getEvent(eventId, pool) {
  try {
    const text = `
      SELECT * FROM messages WHERE id=$1
    `;
    const values = [eventId];
    return pool.query(text, values);
  } catch (error) {
    console.log(error);
  }
}

// Get all messages from the DB within 3km from an event with given id
function getNearByEvents(event, pool) {
  try {
    const text = `
      SELECT *, (((ACOS(SIN(($1*PI()/180)) * SIN((lat*PI()/180)) + COS(($1*PI()/180)) * COS((lat*PI()/180)) * COS((($2 - lon)*PI()/180)))) * 180/PI()) * 60 * 1.1515 * 1.609344) AS distance
      FROM messages
      WHERE (((ACOS(SIN(($1*PI()/180)) * SIN((lat*PI()/180)) + COS(($1*PI()/180)) * COS((lat*PI()/180)) * COS((($2 - lon)*PI()/180)))) * 180/PI()) * 60 * 1.1515 * 1.609344) <= 3000;
    `;
    const values = [event.lat, event.lon];
    return pool.query(text, values); 
  } catch (error) {
    console.log(error);
  }
}

function createDifficulty(eventId, userId, pool) {
  try {
    const text = `
      INSERT INTO difficulties ("status", "messageId", "userId", "createdAt", "updatedAt")
      VALUES (0, $1, $2, NOW(), NOW())
      RETURNING id
    `;
    const values = [eventId, userId];
    return pool.query(text, values);
  } catch (error) {
    console.log(error);
  }
}

function updateDifficulty(difficultyId, difficulty, pool) {
  try {
    const text = `
      UPDATE difficulties
      SET value=$1, status=1
      WHERE id=$2
    `;
    const values = [difficulty, difficultyId];
    return pool.query(text, values);
  } catch (error) {
    console.log(error);
  }
}

// Event difficutly Function
function eventDifficulty(event, events) {
  // use a maximum of 2000 events
  if (events.length > 2000) {
    events = events.slice(-2000);
  };
  // calculate difficulty
  let difficulty = 0;
  for (let i = 0; i < events.length; i++) {
    difficulty += (events[i].level) * events[i].distance / 100;
  }
  // return difficulty
  return difficulty;
}

//For sending emails if the job is finished
//adapted from https://towardsdev.com/learn-how-to-send-emails-using-nodemailer-with-node-js-and-react-js-b8c4606faf83
const Email = options => {
  
  let transporter = NodeMailer.createTransport({
      service:"hotmail",
      auth:{
          user: `${process.env.EMAIL_SENDER}`,
          pass: `${process.env.EMAIL_SENDER_PASSWORD}`,
      }
  })
  transporter.sendMail(options, (err,info) =>{
      if (err) {
          console.log(err);
          return;
      }
  });
};

const EmailSender = (receiver_email, difficulty) => {
  const options = {
      from: `${process.env.EMAIL_SENDER}`,
      to: receiver_email,
      subject: 'Dificultad calculada',
      html: `<p>¡Hola! la dificultad del evento fue calculada, tiene un valor de: ${difficulty}</p>`
  };
  Email(options)
}

// Redis connection
const eventQueue = new Queue('calculating difficulty', { 
  redis: { 
    port: process.env.REDIS_PORT || 6379, 
    host: process.env.REDIS_HOST || 'redis', 
    password: process.env.REDIS_PASSWORD || 'redis', 
  },
});

// Process the queue
eventQueue.process(async function (job, done) {
  // Create difficulty in DB
  const difficulty_response = await createDifficulty(job.data.messageId, job.data.userId, pool);
  const difficultyId = difficulty_response.rows[0].id;
  // Get event from DB
  const event_response = await getEvent(job.data.messageId, pool);
  const event = event_response.rows[0];
  // Get nearby events from DB
  const events_response = await getNearByEvents(event, pool);
  const events = events_response.rows;
  // Calculate the difficulty
  const difficulty = eventDifficulty(event, events);
  // Update difficulty in DB
  await updateDifficulty(difficultyId, difficulty, pool);

  //Get user email and send email
  const user_response = await getUser(job.data.userId, pool);
  const user_email = user_response.rows[0].email;
  EmailSender(user_email, difficulty);

  // Return difficulty
  done(null, { difficulty });
});

console.log("Worker Listening to Tasks...")

// Messages for when jobs are completed or have failed
eventQueue.on('completed', (job, result) => {
  console.log(`messageId: ${job.data.messageId}`);
  console.log(`Worker completed with result ${JSON.stringify(result)}`);
  
})
eventQueue.on('error', (error) => {
  console.log(`Worker completed with error: ${error}` );
})

module.exports = eventQueue;