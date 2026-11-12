# Library Management System

A beginner-friendly Library Management System built with Java, Spring Boot, Spring Data JPA, Hibernate, MySQL, and a small HTML/CSS/JavaScript frontend.

## Features

- Add a book
- View all books
- View one book by ID through the REST API
- Update a book
- Delete a book
- Validate required fields and non-negative quantity
- Prevent duplicate ISBN values
- Responsive browser interface

## Requirements

- JDK 17 or later
- Maven 3.6+
- MySQL 8+ (or use the optional H2 profile)

## Run with MySQL

1. Start MySQL.
2. Open `src/main/resources/application.properties`.
3. Replace `YOUR_MYSQL_PASSWORD` with your local MySQL password.
4. The application creates the `library_db` database automatically if your MySQL user has permission.
5. Open a terminal in the project folder and run:

   ```bash
   mvn spring-boot:run
   ```

6. Open `http://localhost:8080`.

## Run without MySQL (H2)

The project includes an optional in-memory H2 profile for a quick local demo. Run:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

Open `http://localhost:8080`. H2 data is temporary and resets when the application stops.

## REST API

Base URL: `http://localhost:8080/api/books`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/books` | Get all books |
| GET | `/api/books/{id}` | Get a book by ID |
| POST | `/api/books` | Add a book |
| PUT | `/api/books/{id}` | Update a book |
| DELETE | `/api/books/{id}` | Delete a book |

### Example POST / PUT JSON

```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "9780132350884",
  "category": "Programming",
  "quantity": 5
}
```

## Test with Postman

1. Start the application.
2. Send `POST http://localhost:8080/api/books` with the JSON above.
3. Send `GET http://localhost:8080/api/books` to see all books.
4. Copy an ID from the response and use `GET /api/books/{id}`.
5. Use `PUT /api/books/{id}` with updated JSON.
6. Use `DELETE /api/books/{id}` to remove the record.

## Project structure

```text
src/main/java/com/vinay/library/
├── LibraryManagementSystemApplication.java
├── controller/
│   └── BookController.java
├── entity/
│   └── Book.java
├── exception/
│   ├── GlobalExceptionHandler.java
│   └── ResourceNotFoundException.java
├── repository/
│   └── BookRepository.java
└── service/
    └── BookService.java

src/main/resources/
├── application.properties
├── application-h2.properties
└── static/
    ├── index.html
    ├── style.css
    └── app.js
```

## Architecture

Browser / Postman → BookController → BookService → BookRepository → MySQL

- **Entity:** Maps the `Book` Java class to the `books` database table.
- **Repository:** Uses Spring Data JPA for database operations.
- **Service:** Contains the book-management business logic.
- **Controller:** Exposes REST endpoints.
- **Global exception handler:** Returns readable error responses.

## Notes

- This is a simple learning project, not a production-ready library platform.
- It does not include authentication, book issuing/returns, or user management.
- The MySQL password is kept in local configuration. Do not commit real credentials to GitHub.
