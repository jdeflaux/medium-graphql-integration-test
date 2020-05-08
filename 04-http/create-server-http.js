const { ApolloServer, gql } = require('apollo-server');
const { request } = require('graphql-request');

const createServerSimple = () => {
  // graphql schema definition
  const typeDefs = gql`
      type Country {
        code: ID
        name: String
      }

      type Query {
        countries: [Country]
      }
    `;

  // resolvers: to map queries & mutation to actual functions
  const resolvers = {
    Query: {
      countries: () => request('https://countries.trevorblades.com/', `
          query getCountries {
            countries {
              code
              name
            }
          }
        `
      )
      .then(result => result.countries)
    },
  };

  // The ApolloServer constructor
  const server = new ApolloServer({ typeDefs, resolvers });

  // we don't run server.listen() here. The server is not yet started.
  return server;
};

module.exports = createServerSimple;
