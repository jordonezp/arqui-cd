const mqtt = require('mqtt');
const fetch = require('node-fetch');
require('dotenv').config();

async function sendMassage(message) {
  // console.log(message);
  // console.log(`${process.env.APP_HOST}`);

  const response = await fetch(`${process.env.APP_HOST}/messages`, {
    method: 'POST',
    body: message, // string or object
    headers: {
      'Content-Type': 'application/json'
    }
  });

  response;
}

async function connectClient(url) {
  try {
    const options = {
      clean: true,
      port: 9000,
      clientId: 'mqttjs_1',
      username: 'common',
      password: 'iic2173',
    };
    const client = await mqtt.connect(url, options);
    client.on('connect', () => {
      // console.log(`connected flag  ${client.connected}`);
      client.subscribe('global-emergencies');
      
    });
    client.on('message', (topic, message) => {
      sendMassage(message);
    });
    // return client;
  } catch (error) {
    return false;
  }
}

connectClient('mqtt:planetaryevents.iic2173.net:9000');
