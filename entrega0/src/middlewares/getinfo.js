// fetch de get job/:id, get job, heartbeat
const fetch = require('node-fetch');
require('dotenv').config();

async function fetchGetHeartbeat() {
  let response_body;
  await fetch(`${process.env.PRODUCER_HOST}/heartbeat`)
    .then(response=>response.json())
    .then(data=>{ response_body = data; });
  return response_body;
}

async function fetchPostJob(job) {
  const response =  await fetch(`${process.env.PRODUCER_HOST}/job`,{
    method: 'POST',
    body: job,
    headers: {
      'Content-Type':'application/json'
    }
  });
  response;
}

// async function fetchGetJob(id) {
//   let response_body;
//   let response_data;
//   await fetch(`${process.env.PRODUCER_HOST}/job/${id}`)
//     .then(response => { response_body = response; })
//     .then(data => { response_data = data; });
//   console.log(response_body);
//   console.log('------------------------');
//   console.log(response_data);
//   // return response_data;
// }

async function fetchGetJob(id) {
  let response_body;
  await fetch(`${process.env.PRODUCER_HOST}/job/${id}`, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data=>{ response_body = data; });
    return response_body;
}

module.exports = { fetchGetHeartbeat, fetchGetJob, fetchPostJob };