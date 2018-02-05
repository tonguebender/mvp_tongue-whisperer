const axios = require('axios');

const TONGUOLOGY_URL = process.env.TONGUOLOGY_URL;
const SEND_MESSAGE_URL = `${TONGUOLOGY_URL}/user_message`;
const SUBSCRIBE_URL = `${TONGUOLOGY_URL}/subscription`;

function getUserUrl(id) {
  return `${TONGUOLOGY_URL}/user/${id}`;
}

function createUser(id, data) {
  console.log('createUser', id, data);

  return axios.post(getUserUrl(id), data)
    .then(user => user)
    .catch(err => ({}));
}

function subscribeUser(id, data) {
  console.log('subscribeUser', id, data);
  const { courseId } = data;

  return axios.post(SUBSCRIBE_URL, { userId: id, courseId })
    .then(user => user)
    .catch(err => ({}));
}

function sendMessage(id, text) {
  return axios.post(SEND_MESSAGE_URL, { id, text })
    .then(user => user)
    .catch(err => ({}));
}

module.exports = {
  createUser,
  subscribeUser,
  sendMessage
};
