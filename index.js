const createServer = require('./01-simple/create-server-simple');
const createServerEach = require('./02-each/create-server-each');
const createServerMongo = require('./03-mongo/create-server-mongo');


createServer().listen(8080);
createServerEach().listen(8081);

console.log('simple server: at http://localhost:8080');
console.log('each server:   at http://localhost:8081');


// for faking a mongo at runtime, unrelated to how we test it
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoServer = new MongoMemoryServer();
mongoServer.getUri().then((mongoUri) => {
  console.log({ mongoUri });
  console.log('each mongo:    at http://localhost:8082');
  return createServerMongo(mongoUri).listen(8082);
}).catch(() => process.exit(1));
