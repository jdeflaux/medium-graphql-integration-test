// with jest-each 😎

const { createTestClient } = require('apollo-server-testing');
const createServer = require('./create-server-each');

// describe test cases
test.each`
  isbn             | expected
  ${'0552166596'}  | ${[{ isbn: '0552166596', name: 'The Colour Of Magic' }]}
  ${'wrong isbn'}  | ${[]}
  ${undefined}     | ${[{ isbn: '0552166596', name: 'The Colour Of Magic' }]}
`('books($isbn) = $expected', async ({ isbn, expected }) => {
  // then 1 test implementation

  const server = createServer();
  const { query } = createTestClient(server);

  // graphl query
  const parameters = isbn ? `(isbn: "${isbn}")` : '';
  const GET_BOOKS = `
  {
    books ${parameters} {
      isbn
      name
    }
  }
  `;

  // act
  const response = await query({ query: GET_BOOKS });

  // assert
  expect(response.data.books).toEqual(expected);
});
