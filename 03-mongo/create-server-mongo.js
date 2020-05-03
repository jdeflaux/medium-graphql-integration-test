const { ApolloServer, gql } = require('apollo-server');

const MongoClient = require('mongodb').MongoClient;

let mongoConnection;

const createServerMongo = (mongoUrl) => {
  // graphql schema definition
  const typeDefs = gql`
      type Book {
        isbn: ID
        name: String
      }

      type Query {
        books(isbn: ID): [Book]
      }

      type Mutation {
        add(isbn:String, name: String): Int
      }
    `;

  mongoConnection = MongoClient.connect(mongoUrl);
  const mongodb = mongoConnection.then(client => client.db());

  const resolvers = {
    Query: {
      books: async (parent, { isbn }) => {
        const db = await mongodb;
        const filter = isbn ? { isbn } : undefined;
        return db.collection('books')
          .find(filter)
          .toArray();
      }
    },
    Mutation: {
      add: async (parent, { isbn, name }) => {
        const db = await mongodb;
        return db.collection('books')
          .insertOne({ isbn, name })
          .then(r => r.result.ok);
      }
    }
  };

  // The ApolloServer constructor
  const server = new ApolloServer({ typeDefs, resolvers });

  // we don't run server.listen() here. The server is not yet started.
  return server;
};

module.exports.createServer = createServerMongo;
module.exports.getMongoConnection = () => mongoConnection;
