const env = process.env.NODE_ENV;

let MYSQL_CONF;

let REDIS_CONF;

if (env === "production") {
  MYSQL_CONF = {};
  REDIS_CONF = {};
} else if (env === "dev") {
  MYSQL_CONF = {
    port: "3306",
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "node-learn-blog-1"
  };

  REDIS_CONF = {
    port: "6379",
    host: "127.0.0.1"
  };
}

module.exports = { MYSQL_CONF, REDIS_CONF };
