const Buffer = require("safe-buffer").Buffer;
const Keygrip = require('keygrip');
const keys = require('../../config/keys');

const keygrip = new Keygrip([keys.cookieKey]);

module.exports = (user) => {
  const sessionObject = {
    passport: {
      user: user._id.toString()
    },
  };
  // Buffer.from(session, 'base64').toString('utf8')
  const session = Buffer.from(JSON.stringify(sessionObject)).toString(
    'base64'
    );
  const sig = keygrip.sign('session=' + session);

  return { session, sig }
}
