// testing library
const { createTestClient } = require('apollo-server-testing');
const { QueryMock } = require('graphql-query-test-mock');


// our first file that exports the function that creates a new apollo server
const createServer = require('./create-server-http');

test('read a list of countries name', async () => {
  // create a new instance of our server (not listening on any port)
  const server = createServer();
  const { query } = createTestClient(server);

  // mock coutries api
  const mockApi = new QueryMock();
  mockApi.setup('https://countries.trevorblades.com/');
  mockApi.mockQuery({
    name: 'getCountries',
    data: {
      countries: [{
        code: 'FRA',
        name: 'France'
      }]
    }
  });

  // graphl query
  const GET_COUNTRIES = `
  {
    countries {
      name
    }
  }
  `;

  // act
  const response = await query({ query: GET_COUNTRIES });

  // assert
  expect(response.data.countries).toEqual([{ name: 'France' }]);
});
