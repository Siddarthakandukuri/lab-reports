CREATE TABLE IF NOT EXISTS book (
  id INTEGER PRIMARY KEY,
  title TEXT,
  author TEXT,
  price INTEGER,
  pages INTEGER
);

INSERT INTO book (title, author, price, pages) VALUES
('The Alchemist', 'Paulo Coelho', 299, 208),
('Wings of Fire', 'A. P. J. Abdul Kalam', 350, 180),
('The Guide', 'R. K. Narayan', 275, 220),
('Godan', 'Munshi Premchand', 199, 336),
('The God of Small Things', 'Arundhati Roy', 399, 340),
('Malgudi Days', 'R. K. Narayan', 249, 256),
('The White Tiger', 'Aravind Adiga', 325, 321),
('Train to Pakistan', 'Khushwant Singh', 280, 181),
('Gitanjali', 'Rabindranath Tagore', 150, 120),
('Midnight''s Children', 'Salman Rushdie', 450, 647);
