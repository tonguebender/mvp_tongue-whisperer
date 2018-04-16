const axios = require('axios');

const TONGUOLOGY_URL = process.env.TONGUOLOGY_URL;
const SEND_MESSAGE_URL = `${TONGUOLOGY_URL}/user_message`;
const CALL_ACTION_URL = `${TONGUOLOGY_URL}/call_action`;
const SUBSCRIBE_URL = `${TONGUOLOGY_URL}/subscription`;
const UNSUBSCRIBE_URL = `${TONGUOLOGY_URL}/unsubscribe`;

function getUserUrl(id) {
  return `${TONGUOLOGY_URL}/user/${id}`;
}

function createUser(id, data) {
  return axios.post(getUserUrl(id), data)
    .then(user => user)
    .catch(err => ({}));
}

function subscribeUser(id, data) {
  const { courseId } = data;

  return axios.post(SUBSCRIBE_URL, { userId: id, courseId })
    .then(user => user)
    .catch(err => ({}));
}

function unsubscribeUser(id, data) {
  const { courseId } = data;

  return axios.post(UNSUBSCRIBE_URL, { userId: id, courseId })
    .then(user => user)
    .catch(err => ({}));
}

function sendMessage(id, data) {
  return axios.post(SEND_MESSAGE_URL, { id, ...data })
    .then(user => user)
    .catch(err => ({}));
}

function callAction({ action, userId, text }) {
  return axios.post(CALL_ACTION_URL, Object.assign({ action, userId, text }))
    .then(user => user)
    .catch(err => ({}));
}

module.exports = {
  createUser,
  subscribeUser,
  unsubscribeUser,
  sendMessage,

  callAction
};
