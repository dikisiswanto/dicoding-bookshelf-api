const { nanoid } = require('nanoid');
const books = require('./books');

function addBook(request, h) {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  let response = null;

  if (!name) {
    response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (pageCount < readPage) {
    response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
}

function getAllBooks(request, h) {
  const { name: bookName, reading, finished } = request.query;
  let data = books;

  if (bookName) {
    data = data.filter((book) => book.name.toLowerCase().includes(bookName.toLowerCase()));
  }

  if (reading) {
    data = data.filter((book) => book.reading === !!parseInt(reading, 10));
  }

  if (finished) {
    data = data.filter((book) => book.finished === !!parseInt(finished, 10));
  }

  return h.response({
    status: 'success',
    data: { books: data.map(({ id, name, publisher }) => ({ id, name, publisher })) },
  });
}

function getBookById(request, h) {
  const { bookId } = request.params;
  const book = books.filter((b) => b.id === bookId)[0];

  if (book !== undefined) {
    return h.response({
      status: 'success',
      data: {
        book,
      },
    });
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
}

const handler = {
  addBook,
  getAllBooks,
  getBookById,
};

module.exports = { handler };