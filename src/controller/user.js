const exec = require("../db/mysql");

/**
 *
 * @param {*} body
 */
const login = body => {
  const { username, password } = body;
  
  let sql = `select username, realname from users where username='${username}' and password='${password}' `;
  return exec(sql).then(result => {
    return result[0];
  });

};

module.exports = {
  login
};
