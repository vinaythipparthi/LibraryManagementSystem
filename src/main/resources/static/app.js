const API_URL = "/api/books";

const form = document.getElementById("bookForm");
const tableBody = document.getElementById("bookTable");
const message = document.getElementById("message");

document.addEventListener("DOMContentLoaded", loadBooks);
document.getElementById("refreshButton").addEventListener("click", loadBooks);
document.getElementById("cancelEdit").addEventListener("click", resetForm);

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = document.getElementById("bookId").value;
    const book = {
        title: document.getElementById("title").value.trim(),
        author: document.getElementById("author").value.trim(),
        isbn: document.getElementById("isbn").value.trim(),
        category: document.getElementById("category").value.trim(),
        quantity: Number(document.getElementById("quantity").value)
    };

    try {
        const response = await fetch(id ? `${API_URL}/${id}` : API_URL, {
            method: id ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(book)
        });

        if (!response.ok) throw new Error(await readError(response));
        showMessage(id ? "Book updated successfully." : "Book added successfully.", "success");
        resetForm();
        await loadBooks();
    } catch (error) {
        showMessage(error.message || "Something went wrong.", "error");
    }
});

async function loadBooks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Could not load books.");
        const books = await response.json();
        document.getElementById("bookCount").textContent = books.length;

        if (books.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="empty">No books yet. Add your first book above.</td></tr>';
            return;
        }

        tableBody.innerHTML = "";
        books.forEach(book => {
            const row = document.createElement("tr");
            appendCell(row, book.title);
            appendCell(row, book.author);
            appendCell(row, book.isbn);
            appendCell(row, book.category || "-");
            appendCell(row, book.quantity);

            const actionCell = document.createElement("td");
            const actions = document.createElement("div");
            actions.className = "action-buttons";

            const editButton = document.createElement("button");
            editButton.className = "secondary";
            editButton.textContent = "Edit";
            editButton.addEventListener("click", () => startEdit(book));

            const deleteButton = document.createElement("button");
            deleteButton.className = "danger";
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => deleteBook(book.id));

            actions.append(editButton, deleteButton);
            actionCell.appendChild(actions);
            row.appendChild(actionCell);
            tableBody.appendChild(row);
        });
    } catch (error) {
        tableBody.innerHTML = `<tr><td colspan="6" class="empty">${escapeHtml(error.message)}</td></tr>`;
    }
}

function appendCell(row, value) {
    const cell = document.createElement("td");
    cell.textContent = value ?? "";
    row.appendChild(cell);
}

function startEdit(book) {
    document.getElementById("bookId").value = book.id;
    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("isbn").value = book.isbn;
    document.getElementById("category").value = book.category || "";
    document.getElementById("quantity").value = book.quantity;
    document.getElementById("formTitle").textContent = "Update book";
    document.getElementById("submitButton").textContent = "Save changes";
    document.getElementById("cancelEdit").classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteBook(id) {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error(await readError(response));
        showMessage("Book deleted successfully.", "success");
        await loadBooks();
    } catch (error) {
        showMessage(error.message || "Could not delete book.", "error");
    }
}

function resetForm() {
    form.reset();
    document.getElementById("bookId").value = "";
    document.getElementById("quantity").value = 1;
    document.getElementById("formTitle").textContent = "Add a book";
    document.getElementById("submitButton").textContent = "Add book";
    document.getElementById("cancelEdit").classList.add("hidden");
}

function showMessage(text, type) {
    message.textContent = text;
    message.className = type;
}

async function readError(response) {
    try {
        const body = await response.json();
        return body.error || Object.values(body).join(", ") || "Request failed.";
    } catch {
        return "Request failed. Please try again.";
    }
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[char]);
}
