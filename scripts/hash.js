const crypto = require('crypto');

module.exports = function (content) {
  return crypto.createHash('md5').update(content).digest('hex').slice(0, 12)
}
