# Library Management System Database

## Overview

This project is a comprehensive Library Management System database built with MySQL. It provides a complete database solution for managing a library's resources, members, and operations.

## Features

- **Member Management**: Track member information, membership status, and history
- **Book Catalog**: Comprehensive book metadata with categorization and author information
- **Inventory Management**: Track individual book copies, their condition, and location
- **Circulation System**: Handle checkouts, returns, renewals, and reservations
- **Fine Management**: Automatically calculate and track overdue and damage fines
- **Staff Management**: Store staff details with role-based access control
- **Reporting**: Pre-built views for common reports like available books and overdue items
- **Audit Trail**: Complete logging of all system activities

## Database Schema

The database includes the following tables:

- **Members**: Library patrons with membership details
- **Books**: Book metadata (title, ISBN, publication info)
- **Book_Copies**: Individual physical copies of books
- **Authors**: Author information
- **Publishers**: Publisher details
- **Categories**: Hierarchical book classification system
- **Loans**: Book checkout records
- **Reservations**: Book reservation requests
- **Fines**: Monetary penalties for late returns or damages
- **Staff**: Library employee records
- **Event_Log**: System activity audit trail

Relationship tables:
- **Book_Authors**: Many-to-many relationship between books and authors
- **Book_Categories**: Many-to-many relationship between books and categories

## Setup Instructions

### Prerequisites

- MySQL 8.0 or higher

### Installation

1. Clone the repository or download the SQL file
2. Connect to your MySQL server:
   ```bash
   mysql -u username -p
   ```
3. Execute the SQL file:
   ```bash
   source /path/to/library_management_system.sql
   ```

The script will:
- Create a new database named `library_management`
- Create all necessary tables with appropriate constraints
- Populate the tables with sample data
- Create views, stored procedures, triggers, and events

### Sample Data

The database comes pre-loaded with sample data including:
- 5 members
- 5 books (with multiple copies)
- 5 authors
- 5 publishers
- 10 categories
- Sample loans, reservations, and fines

## Usage Examples

### Common Stored Procedures

#### Checking Out a Book
```sql
CALL check_out_book(copy_id, member_id, staff_id, loan_days);
```

#### Returning a Book
```sql
CALL return_book(copy_id, staff_id, condition);
```

#### Renewing a Loan
```sql
CALL renew_loan(loan_id, staff_id, renewal_days);
```

### Useful Views

#### Available Books
```sql
SELECT * FROM available_books_view;
```

#### Overdue Loans
```sql
SELECT * FROM overdue_loans_view;
```

#### Member Activity Summary
```sql
SELECT * FROM member_activity_view;
```

## Database Design Features

- **Proper Constraints**: Primary keys, foreign keys, NOT NULL, UNIQUE, and CHECK constraints
- **Relationship Types**: One-to-one, one-to-many, many-to-many, and self-referential relationships
- **Normalization**: Tables designed following database normalization principles
- **Indexing**: Strategic indexing for performance optimization
- **Views**: Pre-built views for common queries
- **Stored Procedures**: Encapsulated business logic
- **Triggers and Events**: Automated processes for maintenance tasks

## Technical Specifications

- MySQL 8.0 compatibility
- UTF-8 character encoding
- Support for transaction processing
- Automated fine calculation
- Audit logging for all significant operations

## License

This project is available under the MIT License.

## Contributors

- Your Name

## Acknowledgments

- Created as part of Database Design & Programming with SQL course at Class Academy, Feb 2025