const {exec,escape} = require("../db/mysql");
const genPassword = require('../utils/cryp.js')
/**
 *
 * @param {*} body
 */
const login = body => {
  let { username, password } = body;
  username = escape(username)
  password = genPassword(password)
  password = escape(password)
  let sql = `select username, realname from users where username=${username} and password=${password} `;
  
  return exec(sql).then(result => {
    return result[0];
  });

};

module.exports = {
  login
};
