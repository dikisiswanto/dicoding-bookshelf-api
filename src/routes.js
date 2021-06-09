const { handler } = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: handler.addBook,
  },
  {
    method: 'GET',
    path: '/books',
    handler: handler.getAllBooks,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: handler.getBookById,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: handler.updateBookById,
  },
];

module.exports = routes;
