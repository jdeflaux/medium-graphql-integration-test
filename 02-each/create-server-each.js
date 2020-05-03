const { ApolloServer, gql } = require('apollo-server');

// inspired from
// https://www.apollographql.com/docs/apollo-server/getting-started/

const createServerEach = () => {
  // graphql schema definition
  const typeDefs = gql`
      type Book {
        isbn: ID
        name: String
      }

      type Query {
        books(isbn: ID): [Book]
      }
    `;

  // static list of books
  const books = [{ isbn: '0552166596', name: 'The Colour Of Magic' }];

  // resolvers: to map queries & mutation to actual functions
  const resolvers = {
    Query: {
      books: (parent, { isbn }) => (isbn ? books.filter(t => t.isbn === isbn) : books)
    },
  };

  // The ApolloServer constructor
  const server = new ApolloServer({ typeDefs, resolvers });

  // we don't run server.listen() here. The server is not yet started.
  return server;
};

module.exports = createServerEach;
