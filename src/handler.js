const { nanoid } = require('nanoid');
const books = require('./books');

function addBook(request, h) {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  if (pageCount < readPage) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
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
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    }).code(201);
  }

  return h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  }).code(500);
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

  if (book) {
    return h.response({
      status: 'success',
      data: {
        book,
      },
    });
  }

  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  }).code(404);
}

function updateBookById(request, h) {
  const { bookId } = request.params;
  const {
    name, pageCount, readPage, ...others
  } = request.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (pageCount < readPage) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const index = books.findIndex((b) => b.id === bookId);
  const updatedAt = new Date().toISOString();

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      pageCount,
      readPage,
      updatedAt,
      ...others,
    };

    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
  }

  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404);
}

function deleteBookById(request, h) {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
}

const handler = {
  addBook,
  getAllBooks,
  getBookById,
  updateBookById,
  deleteBookById,
};

module.exports = { handler };
