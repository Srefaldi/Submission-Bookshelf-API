const { nanoid } = require('nanoid');
const books = require('./books');

// Untuk Menambahkan Buku
const addBooksHandler = (request, h) => {
  const {
    name, year, author, summary, publisher,
    pageCount, readPage, reading,
  } = request.payload;

  // Validasi properti 'name'
  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const bookId = nanoid(10);
  const finished = readPage === pageCount;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id: bookId,
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

  return h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId,
    },
  }).code(201);
};

// Untuk Menampilkan Buku
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let saveMap = books.slice();

  if (name) {
    saveMap = saveMap.filter((bn) => bn.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading === '0' || reading === '1') {
    saveMap = saveMap.filter((book) => Number(book.reading) === Number(reading));
  }

  if (finished === '0' || finished === '1') {
    saveMap = saveMap.filter((book) => Number(book.finished) === Number(finished));
  }

  const response = h.response({
    status: 'success',
    data: {
      books: saveMap.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });

  response.code(200);
  return response;
};
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const foundBook = books.find((book) => book.id === bookId);

  if (!foundBook) {
    return h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    }).code(404);
  }

  return h.response({
    status: 'success',
    data: {
      book: foundBook,
    },
  }).code(200);
};

// Edit Buku
const updateBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher,
    pageCount, readPage, reading,
  } = request.payload;

  const foundIndex = books.findIndex((book) => book.id === bookId);

  if (foundIndex === -1) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
  }

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  books[foundIndex] = {
    ...books[foundIndex],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt: new Date().toISOString(),
  };

  return h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  }).code(200);
};
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const foundIndex = books.findIndex((book) => book.id === bookId);

  if (foundIndex === -1) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
  }

  books.splice(foundIndex, 1);

  return h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  }).code(200);
};

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};
