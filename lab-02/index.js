const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "books.db");
const PORT = process.env.PORT || 3000;

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/`);
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

const isValidBook = ({ title, author, price, pages }) =>
  typeof title === "string" && title.trim() !== "" &&
  typeof author === "string" && author.trim() !== "" &&
  Number.isInteger(price) && price >= 0 &&
  Number.isInteger(pages) && pages > 0;

// GET all books
app.get("/books/", async (request, response) => {
  try {
    const books = await db.all("SELECT * FROM book ORDER BY id;");
    response.send(books);
  } catch (e) {
    response.status(500).send({ error: "Internal server error" });
  }
});

// GET one book
app.get("/books/:bookId/", async (request, response) => {
  try {
    const { bookId } = request.params;
    const book = await db.get("SELECT * FROM book WHERE id = ?;", [bookId]);
    if (book === undefined) {
      return response.status(404).send({ error: "Book not found" });
    }
    response.send(book);
  } catch (e) {
    response.status(500).send({ error: "Internal server error" });
  }
});

// POST add a book
app.post("/books/", async (request, response) => {
  try {
    if (!isValidBook(request.body)) {
      return response.status(400).send({
        error: "title, author (strings), price (integer >= 0) and pages (integer > 0) are required",
      });
    }
    const { title, author, price, pages } = request.body;
    const result = await db.run(
      "INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?);",
      [title, author, price, pages]
    );
    response.status(201).send({ bookId: result.lastID });
  } catch (e) {
    response.status(500).send({ error: "Internal server error" });
  }
});

// PUT update a book
app.put("/books/:bookId/", async (request, response) => {
  try {
    const { bookId } = request.params;
    if (!isValidBook(request.body)) {
      return response.status(400).send({
        error: "title, author (strings), price (integer >= 0) and pages (integer > 0) are required",
      });
    }
    const { title, author, price, pages } = request.body;
    const result = await db.run(
      "UPDATE book SET title = ?, author = ?, price = ?, pages = ? WHERE id = ?;",
      [title, author, price, pages, bookId]
    );
    if (result.changes === 0) {
      return response.status(404).send({ error: "Book not found" });
    }
    response.send({ message: "Book updated" });
  } catch (e) {
    response.status(500).send({ error: "Internal server error" });
  }
});

// DELETE a book
app.delete("/books/:bookId/", async (request, response) => {
  try {
    const { bookId } = request.params;
    const result = await db.run("DELETE FROM book WHERE id = ?;", [bookId]);
    if (result.changes === 0) {
      return response.status(404).send({ error: "Book not found" });
    }
    response.send({ message: "Book deleted" });
  } catch (e) {
    response.status(500).send({ error: "Internal server error" });
  }
});

module.exports = app;
