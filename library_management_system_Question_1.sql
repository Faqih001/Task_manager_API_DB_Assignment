-- Library Management System Database

-- Drop database if it exists and create a new one
DROP DATABASE IF EXISTS library_management;
CREATE DATABASE library_management;
USE library_management;

-- Create Members table
CREATE TABLE members (
    member_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    address VARCHAR(255),
    date_of_birth DATE,
    membership_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    membership_expiry DATE,
    membership_status ENUM('Active', 'Expired', 'Suspended') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_email CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
);

-- Create Authors table
CREATE TABLE authors (
    author_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_date DATE,
    death_date DATE,
    nationality VARCHAR(50),
    biography TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_dates CHECK (birth_date IS NULL OR death_date IS NULL OR death_date > birth_date)
);

-- Create Publishers table
CREATE TABLE publishers (
    publisher_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    phone_number VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    website VARCHAR(100),
    established_year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Categories table
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    parent_category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

-- Create Books table
CREATE TABLE books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    published_date DATE,
    edition VARCHAR(50),
    language VARCHAR(50) DEFAULT 'English',
    page_count INT,
    publisher_id INT,
    description TEXT,
    cover_image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (publisher_id) REFERENCES publishers(publisher_id) ON DELETE SET NULL
);

-- Create Book_Copies table (represents physical copies of books)
CREATE TABLE book_copies (
    copy_id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT NOT NULL,
    acquisition_date DATE NOT NULL,
    cost DECIMAL(10,2),
    status ENUM('Available', 'Checked Out', 'Reserved', 'In Repair', 'Lost', 'Retired') DEFAULT 'Available',
    book_condition ENUM('New', 'Good', 'Fair', 'Poor') DEFAULT 'New',
    location VARCHAR(50),
    last_inventory_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
);

-- Create Book_Authors table (many-to-many relationship between books and authors)
CREATE TABLE book_authors (
    book_id INT,
    author_id INT,
    role ENUM('Primary', 'Co-author', 'Editor', 'Translator', 'Illustrator') DEFAULT 'Primary',
    PRIMARY KEY (book_id, author_id, role),
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES authors(author_id) ON DELETE CASCADE
);

-- Create Book_Categories table (many-to-many relationship between books and categories)
CREATE TABLE book_categories (
    book_id INT,
    category_id INT,
    PRIMARY KEY (book_id, category_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

-- Create Loans table
CREATE TABLE loans (
    loan_id INT AUTO_INCREMENT PRIMARY KEY,
    copy_id INT NOT NULL,
    member_id INT NOT NULL,
    checkout_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_date DATETIME NOT NULL,
    return_date DATETIME,
    renewed_count INT DEFAULT 0,
    status ENUM('Active', 'Returned', 'Overdue', 'Lost') DEFAULT 'Active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (copy_id) REFERENCES book_copies(copy_id) ON DELETE RESTRICT,
    FOREIGN KEY (member_id) REFERENCES members(member_id) ON DELETE RESTRICT,
    CONSTRAINT chk_dates CHECK (return_date IS NULL OR return_date >= checkout_date),
    CONSTRAINT chk_renewed_count CHECK (renewed_count >= 0 AND renewed_count <= 3)
);

-- Create Fines table
CREATE TABLE fines (
    fine_id INT AUTO_INCREMENT PRIMARY KEY,
    loan_id INT NOT NULL,
    member_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    reason ENUM('Late Return', 'Damaged Item', 'Lost Item') NOT NULL,
    issue_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    paid_date DATE,
    payment_status ENUM('Pending', 'Paid', 'Waived') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (loan_id) REFERENCES loans(loan_id) ON DELETE RESTRICT,
    FOREIGN KEY (member_id) REFERENCES members(member_id) ON DELETE RESTRICT,
    CONSTRAINT chk_amount CHECK (amount > 0)
);

-- Create Reservations table
CREATE TABLE reservations (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT NOT NULL,
    member_id INT NOT NULL,
    reservation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiry_date DATETIME NOT NULL,
    status ENUM('Active', 'Fulfilled', 'Canceled', 'Expired') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES members(member_id) ON DELETE CASCADE,
    UNIQUE KEY (book_id, member_id, status) -- Prevent duplicate active reservations
);

-- Create Staff table
CREATE TABLE staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    position VARCHAR(50) NOT NULL,
    hire_date DATE NOT NULL,
    salary DECIMAL(10,2),
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Event_Log table (for auditing and activity tracking)
CREATE TABLE event_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT NOT NULL,
    staff_id INT,
    member_id INT,
    description TEXT NOT NULL,
    event_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE SET NULL,
    FOREIGN KEY (member_id) REFERENCES members(member_id) ON DELETE SET NULL
);

-- Insert sample data for Members
INSERT INTO members (first_name, last_name, email, phone_number, address, date_of_birth, membership_date, membership_expiry)
VALUES 
('John', 'Smith', 'john.smith@email.com', '555-123-4567', '123 Main St, Anytown, AN 12345', '1985-06-15', '2023-01-15', '2024-01-15'),
('Emily', 'Johnson', 'emily.johnson@email.com', '555-234-5678', '456 Oak Ave, Somecity, SC 23456', '1990-03-22', '2023-02-20', '2024-02-20'),
('Michael', 'Williams', 'michael.williams@email.com', '555-345-6789', '789 Elm Blvd, Othertown, OT 34567', '1978-11-07', '2023-03-10', '2024-03-10'),
('Sarah', 'Brown', 'sarah.brown@email.com', '555-456-7890', '321 Pine Rd, Newville, NV 45678', '1995-09-30', '2023-01-05', '2024-01-05'),
('David', 'Jones', 'david.jones@email.com', '555-567-8901', '654 Cedar Ln, Westburg, WB 56789', '1982-04-18', '2023-04-12', '2024-04-12');

-- Insert sample data for Authors
INSERT INTO authors (first_name, last_name, birth_date, nationality, biography)
VALUES 
('Jane', 'Austen', '1775-12-16', 'British', 'Jane Austen was an English novelist known primarily for her six major novels.'),
('George', 'Orwell', '1903-06-25', 'British', 'George Orwell was an English novelist, essayist, journalist, and critic.'),
('Agatha', 'Christie', '1890-09-15', 'British', 'Dame Agatha Christie was an English writer known for her detective novels.'),
('Mark', 'Twain', '1835-11-30', 'American', 'Mark Twain was an American writer, humorist, entrepreneur, publisher, and lecturer.'),
('Toni', 'Morrison', '1931-02-18', 'American', 'Toni Morrison was an American novelist, essayist, book editor, and college professor.');

-- Insert sample data for Publishers
INSERT INTO publishers (name, address, phone_number, email, website, established_year)
VALUES 
('Penguin Random House', '1745 Broadway, New York, NY 10019', '212-782-9000', 'info@penguinrandomhouse.com', 'www.penguinrandomhouse.com', 1925),
('HarperCollins', '195 Broadway, New York, NY 10007', '212-207-7000', 'info@harpercollins.com', 'www.harpercollins.com', 1817),
('Simon & Schuster', '1230 Avenue of the Americas, New York, NY 10020', '212-698-7000', 'info@simonandschuster.com', 'www.simonandschuster.com', 1924),
('Macmillan Publishers', '120 Broadway, New York, NY 10271', '646-307-5151', 'info@macmillan.com', 'www.macmillan.com', 1843),
('Oxford University Press', 'Great Clarendon Street, Oxford OX2 6DP, UK', '+44-1865-556767', 'oxfordonline@oup.com', 'www.oup.com', 1586);

-- Insert sample data for Categories
INSERT INTO categories (name, description)
VALUES 
('Fiction', 'Literary works based on imagination rather than fact'),
('Non-Fiction', 'Literary works based on facts and real events'),
('Science Fiction', 'Fiction based on imagined future scientific or technological advances'),
('Mystery', 'Fiction dealing with the solution of a crime or puzzle'),
('Biography', 'Non-fiction account of a person\'s life written by someone else'),
('History', 'Non-fiction works about past events'),
('Self-Help', 'Books that provide advice for personal problems'),
('Fantasy', 'Fiction with magical or supernatural elements'),
('Romance', 'Fiction focused on the romantic relationship between characters'),
('Children\'s', 'Books intended for young readers');

-- Update some categories to have parent categories
UPDATE categories SET parent_category_id = 1 WHERE name IN ('Science Fiction', 'Mystery', 'Fantasy', 'Romance');
UPDATE categories SET parent_category_id = 2 WHERE name IN ('Biography', 'History', 'Self-Help');

-- Insert sample data for Books
INSERT INTO books (title, isbn, published_date, edition, language, page_count, publisher_id, description)
VALUES 
('Pride and Prejudice', '9780141439518', '1813-01-28', '200th Anniversary', 'English', 432, 1, 'A romantic novel of manners that follows the character development of Elizabeth Bennet.'),
('1984', '9780451524935', '1949-06-08', 'First Edition', 'English', 328, 2, 'A dystopian social science fiction novel set in a totalitarian future society.'),
('Murder on the Orient Express', '9780062693662', '1934-01-01', 'Reprint', 'English', 256, 3, 'A detective novel featuring the Belgian detective Hercule Poirot.'),
('The Adventures of Huckleberry Finn', '9780486280615', '1884-12-10', 'Unabridged', 'English', 366, 4, 'A novel about a boy named Huck Finn and his friend, an escaped slave named Jim.'),
('Beloved', '9781400033416', '1987-09-16', 'First Edition', 'English', 324, 5, 'A novel inspired by the story of an African American slave who escaped slavery by fleeing to Ohio.');

-- Insert sample data for Book_Copies
INSERT INTO book_copies (book_id, acquisition_date, cost, status, book_condition, location)
VALUES 
(1, '2022-01-15', 15.99, 'Available', 'Good', 'Shelf A-12'),
(1, '2022-01-15', 15.99, 'Checked Out', 'Good', 'Shelf A-12'),
(2, '2022-02-20', 12.50, 'Available', 'New', 'Shelf B-23'),
(2, '2022-02-20', 12.50, 'In Repair', 'Poor', 'Repair Room'),
(3, '2022-03-10', 14.75, 'Available', 'Good', 'Shelf C-34'),
(4, '2022-04-05', 10.25, 'Checked Out', 'Fair', 'Shelf D-45'),
(5, '2022-05-12', 18.99, 'Available', 'New', 'Shelf E-56');

-- Insert sample data for Book_Authors
INSERT INTO book_authors (book_id, author_id, role)
VALUES 
(1, 1, 'Primary'),
(2, 2, 'Primary'),
(3, 3, 'Primary'),
(4, 4, 'Primary'),
(5, 5, 'Primary');

-- Insert sample data for Book_Categories
INSERT INTO book_categories (book_id, category_id)
VALUES 
(1, 1), -- Pride and Prejudice - Fiction
(1, 9), -- Pride and Prejudice - Romance
(2, 1), -- 1984 - Fiction
(2, 3), -- 1984 - Science Fiction
(3, 1), -- Murder on the Orient Express - Fiction
(3, 4), -- Murder on the Orient Express - Mystery
(4, 1), -- Huckleberry Finn - Fiction
(5, 1); -- Beloved - Fiction

-- Insert sample data for Loans
INSERT INTO loans (copy_id, member_id, checkout_date, due_date, return_date, status)
VALUES 
(2, 1, '2023-05-01 14:30:00', '2023-05-15 14:30:00', '2023-05-14 10:15:00', 'Returned'),
(6, 2, '2023-05-10 11:45:00', '2023-05-24 11:45:00', NULL, 'Active'),
(1, 3, '2023-04-15 16:20:00', '2023-04-29 16:20:00', '2023-05-03 09:30:00', 'Returned'),
(3, 4, '2023-05-05 10:10:00', '2023-05-19 10:10:00', '2023-05-18 14:45:00', 'Returned'),
(7, 5, '2023-05-12 15:00:00', '2023-05-26 15:00:00', NULL, 'Active');

-- Insert sample data for Fines
INSERT INTO fines (loan_id, member_id, amount, reason, issue_date, paid_date, payment_status)
VALUES 
(3, 3, 4.00, 'Late Return', '2023-05-03', '2023-05-10', 'Paid'),
(1, 1, 2.50, 'Damaged Item', '2023-05-14', NULL, 'Pending');

-- Insert sample data for Reservations
INSERT INTO reservations (book_id, member_id, reservation_date, expiry_date, status)
VALUES 
(2, 3, '2023-05-15 09:00:00', '2023-05-22 09:00:00', 'Active'),
(5, 4, '2023-05-16 14:30:00', '2023-05-23 14:30:00', 'Active'),
(1, 5, '2023-05-10 11:15:00', '2023-05-17 11:15:00', 'Expired');

-- Insert sample data for Staff
INSERT INTO staff (first_name, last_name, email, phone_number, position, hire_date, salary, username, password_hash, is_admin)
VALUES 
('Robert', 'Anderson', 'r.anderson@library.org', '555-111-2222', 'Head Librarian', '2018-06-15', 65000.00, 'r.anderson', '$2a$10$XdteJfifRg7t9rDmNFCyN.tzrZnRVyeCDVeYVvBNFNJYXbpi0cv3m', TRUE),
('Jennifer', 'Davis', 'j.davis@library.org', '555-222-3333', 'Librarian', '2020-03-22', 48000.00, 'j.davis', '$2a$10$AbdWPPdCh3vr4O7jwiYHmu8r9RHhM7YI9nV8LcnUWEAvEZqgL0QnK', FALSE),
('Thomas', 'Wilson', 't.wilson@library.org', '555-333-4444', 'Assistant Librarian', '2021-11-07', 42000.00, 't.wilson', '$2a$10$hHZ1oVnITVU5rfCVLUftdeuWSGszfh2NngqdSLgEPhRDVlW88YrHO', FALSE);

-- Insert sample data for Event_Log
INSERT INTO event_log (event_type, entity_type, entity_id, staff_id, member_id, description)
VALUES 
('CHECKOUT', 'BOOK_COPY', 2, 1, 1, 'Member checked out "Pride and Prejudice"'),
('RETURN', 'BOOK_COPY', 2, 2, 1, 'Member returned "Pride and Prejudice" with minor damage'),
('FINE_ISSUED', 'MEMBER', 1, 2, 1, 'Fine issued for damaged book'),
('RESERVATION', 'BOOK', 2, 3, 3, 'Member reserved "1984"'),
('NEW_MEMBER', 'MEMBER', 5, 1, NULL, 'New member registered');

-- Create Views

-- View for books that are currently available
CREATE VIEW available_books_view AS
SELECT 
    b.book_id,
    b.title,
    b.isbn,
    a.first_name AS author_first_name,
    a.last_name AS author_last_name,
    c.name AS category_name,
    COUNT(bc.copy_id) AS available_copies
FROM 
    books b
JOIN 
    book_authors ba ON b.book_id = ba.book_id
JOIN 
    authors a ON ba.author_id = a.author_id
JOIN 
    book_categories bc_cat ON b.book_id = bc_cat.book_id
JOIN 
    categories c ON bc_cat.category_id = c.category_id
JOIN 
    book_copies bc ON b.book_id = bc.book_id
WHERE 
    bc.status = 'Available'
GROUP BY 
    b.book_id, b.title, b.isbn, a.first_name, a.last_name, c.name;

-- View for overdue loans
CREATE VIEW overdue_loans_view AS
SELECT 
    l.loan_id,
    b.title,
    CONCAT(m.first_name, ' ', m.last_name) AS member_name,
    m.email,
    m.phone_number,
    l.checkout_date,
    l.due_date,
    DATEDIFF(CURRENT_DATE, l.due_date) AS days_overdue
FROM 
    loans l
JOIN 
    book_copies bc ON l.copy_id = bc.copy_id
JOIN 
    books b ON bc.book_id = b.book_id
JOIN 
    members m ON l.member_id = m.member_id
WHERE 
    l.return_date IS NULL 
    AND l.due_date < CURRENT_DATE
    AND l.status != 'Returned';

-- View for member activity summary
CREATE VIEW member_activity_view AS
SELECT 
    m.member_id,
    CONCAT(m.first_name, ' ', m.last_name) AS member_name,
    m.email,
    COUNT(DISTINCT l.loan_id) AS total_loans,
    SUM(CASE WHEN l.return_date IS NULL AND l.due_date < CURRENT_DATE THEN 1 ELSE 0 END) AS current_overdue,
    COUNT(DISTINCT r.reservation_id) AS total_reservations,
    SUM(CASE WHEN f.payment_status = 'Pending' THEN f.amount ELSE 0 END) AS pending_fines
FROM 
    members m
LEFT JOIN 
    loans l ON m.member_id = l.member_id
LEFT JOIN 
    reservations r ON m.member_id = r.member_id
LEFT JOIN 
    fines f ON m.member_id = f.member_id
GROUP BY 
    m.member_id, member_name, m.email;

-- Create Stored Procedures

-- Procedure to check out a book
DELIMITER //
CREATE PROCEDURE check_out_book(
    IN p_copy_id INT,
    IN p_member_id INT,
    IN p_staff_id INT,
    IN p_loan_days INT
)
BEGIN
    DECLARE v_book_id INT;
    DECLARE v_book_title VARCHAR(255);
    DECLARE v_member_status VARCHAR(20);
    DECLARE v_copy_status VARCHAR(20);
    DECLARE v_due_date DATETIME;
    DECLARE v_pending_fines DECIMAL(10,2);
    
    -- Check if member exists and is active
    SELECT membership_status INTO v_member_status
    FROM members
    WHERE member_id = p_member_id;
    
    IF v_member_status IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Member does not exist';
    ELSEIF v_member_status != 'Active' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Member is not active';
    END IF;
    
    -- Check for pending fines
    SELECT SUM(amount) INTO v_pending_fines
    FROM fines
    WHERE member_id = p_member_id AND payment_status = 'Pending';
    
    IF v_pending_fines > 10 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Member has too many pending fines';
    END IF;
    
    -- Check if copy exists and is available
    SELECT status, book_id INTO v_copy_status, v_book_id
    FROM book_copies
    WHERE copy_id = p_copy_id;
    
    IF v_copy_status IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Book copy does not exist';
    ELSEIF v_copy_status != 'Available' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Book copy is not available';
    END IF;
    
    -- Get book title for event log
    SELECT title INTO v_book_title
    FROM books
    WHERE book_id = v_book_id;
    
    -- Set due date
    SET v_due_date = DATE_ADD(NOW(), INTERVAL p_loan_days DAY);
    
    -- Create loan record
    INSERT INTO loans (copy_id, member_id, checkout_date, due_date, status)
    VALUES (p_copy_id, p_member_id, NOW(), v_due_date, 'Active');
    
    -- Update copy status
    UPDATE book_copies
    SET status = 'Checked Out'
    WHERE copy_id = p_copy_id;
    
    -- Log event
    INSERT INTO event_log (event_type, entity_type, entity_id, staff_id, member_id, description)
    VALUES ('CHECKOUT', 'BOOK_COPY', p_copy_id, p_staff_id, p_member_id, 
           CONCAT('Member checked out "', v_book_title, '"'));
    
    -- Check for and fulfill any reservations
    CALL fulfill_reservation(v_book_id, p_member_id);
    
    SELECT 'Book checked out successfully' AS message;
END //
DELIMITER ;

-- Procedure to return a book
DELIMITER //
CREATE PROCEDURE return_book(
    IN p_copy_id INT,
    IN p_staff_id INT,
    IN p_condition VARCHAR(20)
)
BEGIN
    DECLARE v_loan_id INT;
    DECLARE v_member_id INT;
    DECLARE v_book_id INT;
    DECLARE v_book_title VARCHAR(255);
    DECLARE v_due_date DATETIME;
    DECLARE v_days_overdue INT;
    DECLARE v_old_condition VARCHAR(20);
    DECLARE v_condition_changed BOOLEAN;
    
    -- Check if the book is actually checked out
    SELECT l.loan_id, l.member_id, l.due_date, bc.book_id, bc.book_condition
    INTO v_loan_id, v_member_id, v_due_date, v_book_id, v_old_condition
    FROM loans l
    JOIN book_copies bc ON l.copy_id = bc.copy_id
    WHERE bc.copy_id = p_copy_id AND l.return_date IS NULL AND l.status = 'Active';
    
    IF v_loan_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No active loan found for this book copy';
    END IF;
    
    -- Get book title for event log
    SELECT title INTO v_book_title
    FROM books
    WHERE book_id = v_book_id;
    
    -- Check if return is overdue
    SET v_days_overdue = DATEDIFF(NOW(), v_due_date);
    
    -- Update the loan
    UPDATE loans
    SET return_date = NOW(),
        status = 'Returned'
    WHERE loan_id = v_loan_id;
    
    -- Update the book copy status and condition if needed
    SET v_condition_changed = (v_old_condition != p_condition);
    
    UPDATE book_copies
    SET status = 'Available',
        book_condition = p_condition
    WHERE copy_id = p_copy_id;
    
    -- Log the return
    INSERT INTO event_log (event_type, entity_type, entity_id, staff_id, member_id, description)
    VALUES ('RETURN', 'BOOK_COPY', p_copy_id, p_staff_id, v_member_id, 
           CONCAT('Member returned "', v_book_title, '"'));
    
    -- Create fine if overdue
    IF v_days_overdue > 0 THEN
        INSERT INTO fines (loan_id, member_id, amount, reason, issue_date)
        VALUES (v_loan_id, v_member_id, v_days_overdue * 0.25, 'Late Return', CURDATE());
        
        -- Log the fine
        INSERT INTO event_log (event_type, entity_type, entity_id, staff_id, member_id, description)
        VALUES ('FINE_ISSUED', 'MEMBER', v_member_id, p_staff_id, v_member_id, 
               CONCAT('Late return fine issued for "', v_book_title, '", ', v_days_overdue, ' days overdue'));
    END IF;
    
    -- Create fine if condition changed for the worse
    IF v_condition_changed AND 
       (
         (v_old_condition = 'New' AND p_condition IN ('Good', 'Fair', 'Poor')) OR
         (v_old_condition = 'Good' AND p_condition IN ('Fair', 'Poor')) OR
         (v_old_condition = 'Fair' AND p_condition = 'Poor')
       )
    THEN
        INSERT INTO fines (loan_id, member_id, amount, reason, issue_date)
        VALUES (v_loan_id, v_member_id, 
               CASE 
                   WHEN p_condition = 'Poor' THEN 10.00
                   WHEN p_condition = 'Fair' THEN 5.00
                   ELSE 2.50
               END, 
               'Damaged Item', CURDATE());
        
        -- Log the fine
        INSERT INTO event_log (event_type, entity_type, entity_id, staff_id, member_id, description)
        VALUES ('FINE_ISSUED', 'MEMBER', v_member_id, p_staff_id, v_member_id, 
               CONCAT('Damage fine issued for "', v_book_title, '", condition changed from ', 
                     v_old_condition, ' to ', p_condition));
    END IF;
    
    -- Check if there are active reservations for this book
    CALL check_reservations(v_book_id);
    
    SELECT 'Book returned successfully' AS message;
END //
DELIMITER ;

-- Procedure to renew a loan
DELIMITER //
CREATE PROCEDURE renew_loan(
    IN p_loan_id INT,
    IN p_staff_id INT,
    IN p_renewal_days INT
)
BEGIN
    DECLARE v_copy_id INT;
    DECLARE v_book_id INT;
    DECLARE v_book_title VARCHAR(255);
    DECLARE v_member_id INT;
    DECLARE v_status VARCHAR(20);
    DECLARE v_renewed_count INT;
    DECLARE v_due_date DATETIME;
    DECLARE v_reservation_count INT;
    
    -- Check if the loan exists and is active
    SELECT copy_id, member_id, status, renewed_count, due_date
    INTO v_copy_id, v_member_id, v_status, v_renewed_count, v_due_date
    FROM loans
    WHERE loan_id = p_loan_id;
    
    IF v_status IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Loan does not exist';
    ELSEIF v_status != 'Active' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Only active loans can be renewed';
    END IF;
    
    -- Check if already renewed max times
    IF v_renewed_count >= 3 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Maximum renewal limit reached';
    END IF;
    
    -- Get book_id and title for this copy
    SELECT bc.book_id, b.title 
    INTO v_book_id, v_book_title
    FROM book_copies bc
    JOIN books b ON bc.book_id = b.book_id
    WHERE bc.copy_id = v_copy_id;
    
    -- Check if there are active reservations for this book
    SELECT COUNT(*)
    INTO v_reservation_count
    FROM reservations
    WHERE book_id = v_book_id AND status = 'Active';
    
    IF v_reservation_count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot renew: book has active reservations';
    END IF;
    
    -- Update the loan with new due date and increment renewed_count
    UPDATE loans
    SET due_date = DATE_ADD(v_due_date, INTERVAL p_renewal_days DAY),
        renewed_count = v_renewed_count + 1
    WHERE loan_id = p_loan_id;
    
    -- Log the renewal
    INSERT INTO event_log (event_type, entity_type, entity_id, staff_id, member_id, description)
    VALUES ('RENEWAL', 'LOAN', p_loan_id, p_staff_id, v_member_id, 
           CONCAT('Loan renewed for "', v_book_title, '", new due date: ', 
                 DATE_FORMAT(DATE_ADD(v_due_date, INTERVAL p_renewal_days DAY), '%Y-%m-%d')));
    
    SELECT 'Loan renewed successfully' AS message;
END //
DELIMITER ;

-- Procedure to process reservation
DELIMITER //
CREATE PROCEDURE fulfill_reservation(
    IN p_book_id INT,
    IN p_member_id INT
)
BEGIN
    -- Mark any reservations by this member for this book as fulfilled
    UPDATE reservations
    SET status = 'Fulfilled'
    WHERE book_id = p_book_id AND member_id = p_member_id AND status = 'Active';
END //
DELIMITER ;

-- Procedure to check reservations
DELIMITER //
CREATE PROCEDURE check_reservations(
    IN p_book_id INT
)
BEGIN
    DECLARE v_available_copies INT;
    DECLARE v_reservation_exists INT;
    
    -- Check if there are any available copies of this book
    SELECT COUNT(*)
    INTO v_available_copies
    FROM book_copies
    WHERE book_id = p_book_id AND status = 'Available';
    
    -- Check if there are any active reservations for this book
    SELECT COUNT(*)
    INTO v_reservation_exists
    FROM reservations
    WHERE book_id = p_book_id AND status = 'Active'
    LIMIT 1;
    
    -- If there are available copies and active reservations, notify staff
    IF v_available_copies > 0 AND v_reservation_exists > 0 THEN
        -- In a real system, this would trigger a notification
        -- For this example, we'll just insert a log entry
        INSERT INTO event_log (event_type, entity_type, entity_id, description)
        VALUES ('RESERVATION_READY', 'BOOK', p_book_id, 
               CONCAT('Book available for reservation fulfillment, book_id: ', p_book_id));
    END IF;
END //
DELIMITER ;

-- Trigger to update book_copies status when loan is created
DELIMITER //
CREATE TRIGGER after_loan_insert
AFTER INSERT ON loans
FOR EACH ROW
BEGIN
    UPDATE book_copies
    SET status = 'Checked Out'
    WHERE copy_id = NEW.copy_id;
END //
DELIMITER ;

-- Trigger to automatically mark overdue loans
DELIMITER //
CREATE EVENT update_overdue_loans
ON SCHEDULE EVERY 1 DAY
DO
BEGIN
    UPDATE loans
    SET status = 'Overdue'
    WHERE due_date < NOW() 
    AND return_date IS NULL
    AND status = 'Active';
END //
DELIMITER ;

-- Trigger to expire old reservations
DELIMITER //
CREATE EVENT expire_reservations
ON SCHEDULE EVERY 1 DAY
DO
BEGIN
    UPDATE reservations
    SET status = 'Expired'
    WHERE expiry_date < NOW()
    AND status = 'Active';
END //
DELIMITER ;