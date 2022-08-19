const dayjs = require('dayjs');

function formatMessage(username, text) {
  return {
    username,
    text,
    time: dayjs().format('DD/MM/YYYY h:mm a'),
  };
}

module.exports = { formatMessage };
