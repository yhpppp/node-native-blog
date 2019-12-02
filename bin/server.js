const http = require("http");

const handleServer = require("../app");

const server = http.createServer(handleServer);

server.listen(3000);
