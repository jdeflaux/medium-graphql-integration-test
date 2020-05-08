const createServer = require('./01-simple/create-server-simple');
const createServerEach = require('./02-each/create-server-each');
const { createServerMongo } = require('./03-mongo/create-server-mongo');
const createServerHttp = require('./04-http/create-server-http');

// 01 - simple
createServer().listen(8080);
console.log('simple server: at http://localhost:8080');

// 02- each
createServerEach().listen(8081);
console.log('each server:   at http://localhost:8081');

// 03 - mongo
// for faking a mongo at runtime, unrelated to how we test it
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoServer = new MongoMemoryServer();
mongoServer.getUri().then((mongoUri) => {
  console.log({ mongoUri });
  console.log('mongo:    at http://localhost:8082');
  return createServerMongo(mongoUri).listen(8082);
}).catch(() => process.exit(1));


// 04- http
createServerHttp().listen(8083);
console.log('http:   at http://localhost:8083');
