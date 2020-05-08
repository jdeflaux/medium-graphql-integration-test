// testing library
const { createTestClient } = require('apollo-server-testing');
const { getMongoConnection, createServerMongo } = require('./create-server-mongo');

describe('mongo tests', () => {
  afterAll(() => {
    // to make sure the tests are not hanging around
    // we expose the mongo connection from our code, and close it after all test finished
    return getMongoConnection().then((mongo) => mongo.close());
  });

  test('read / write from mocked mongo', async () => {
    // @shelf/jest-mongodb sets the process.env.MONGO_URL for your convenience
    const server = createServerMongo(process.env.MONGO_URL);
    const { query, mutate } = createTestClient(server);

    // graphl query
    const GET_BOOKS = `
    {
      books {
        isbn
        name
      }
    }
    `;

    // initially empty
    let response = await query({ query: GET_BOOKS });
    expect(response.data.books).toEqual([]);

    // add a book
    const ADD_BOOKS =`
      mutation {
        add(isbn: "B00352B45A", name: "Reaper Man")
      }
    `;
    response = await mutate({ mutation: ADD_BOOKS });
    expect(response.errors).toBeUndefined();

    // not empty anymore, mongo worked!
    response = await query({ query: GET_BOOKS });
    expect(response.data.books).toEqual([{ isbn: 'B00352B45A', name: 'Reaper Man' }]);
  });
});
