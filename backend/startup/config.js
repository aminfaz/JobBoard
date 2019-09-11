const config = require('config');

module.exports = function () {
  if (!config.get('host')) {
    throw new Error('FATAL ERROR: host url is not defined.');
  }
  if (!config.get('database')) {
    throw new Error('FATAL ERROR: database name is not defined.');
  }
  if (!config.get('user')) {
    throw new Error('FATAL ERROR: database user is not defined.');
  }
  if (!config.get('password')) {
    throw new Error('FATAL ERROR: database password is not defined.');
  }
  if (!config.get('remoteResource')) {
    throw new Error('FATAL ERROR: Remote Resource is not defined.');
  }
}