// Book Class: Represents a book
class Book {

    // The value that will be sent when an object is it instanciated
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }

}


// UI Class: Handle UI Tasks
class UI {
    static displayBooks() {

        const books = Store.getBooks();

        // Iterating the array of books
        books.forEach((book) => {
            UI.addBookToList(book);
        });
    }

    static addBookToList(book) {
        const list = document.getElementById('book-list');
        // create a new row
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td>
                <a href="#" class="btn btn-danger btn-sm delete">X</a>
            </td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // Vanish after three seconds
        setTimeout(() => {
            // remove the error message to the user
            document.querySelector('.alert').remove();
        }, 3000);

    }

}

// Store Class: Handles Storage

class Store {

    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        }
        else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        // add the new book to the localStorage
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        
        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}



// Event: Display Books

// As soon as the document loads, show the books
document.addEventListener('DOMContentLoaded', UI.displayBooks);


// Event: Add a book
const bookForm = document.getElementById('book-form');
bookForm.addEventListener('submit', (e) => {
    // prevent actual submit from the form
    e.preventDefault();
    // get form values
    const title = document.getElementById('title').value; 
    const author = document.getElementById('author').value; 
    const isbn = document.getElementById('isbn').value;

    // Validate
    if(title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill out all the fields', 'danger');
    }
    else {
        // Instantiate a new book
        const book = new Book(title, author, isbn);
        console.log(book);
        
        // Add book to UI List
        UI.addBookToList(book);

        // Add book to localStorage
        Store.addBook(book);

        // Show success message
        UI.showAlert('Book Added', 'success');

        // Clear fields
        UI.clearFields();    
    }
});


// Event Remove a book
const bookListDelete = document.querySelector('#book-list');

// In order to delete something we have to do that from the parent perspective
// otherwise it won't work
bookListDelete.addEventListener('click', (e) => {
    
    // Remove book from UI
    UI.deleteBook(e.target);

    // Remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // Show success message
    UI.showAlert('Book Removed', 'success');
});