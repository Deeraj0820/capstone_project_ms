import React, { useState, useEffect, ChangeEvent } from "react";
import { createBook, deleteBook, getAllBooks, updateBook } from "../utils/books.ts";
import { useNavigate } from "react-router-dom";

interface Book {
  id: number;
  name: string;
  author: string;
  description: string;
  SPN_NO: string;
  quantity: number;
  price: number;
  image?: string; // will store Base64-encoded image string
}

const BooksList: React.FC = () => {
  const currentUser = JSON.parse(localStorage.getItem("adminUser") || "{}");
  const [books, setBooks] = useState<Book[]>([]);
  const navigate = useNavigate();

  // Popup and temporary book states
  const [newBook, setNewBook] = useState<Book | null>({
    id: 0,
    name: "",
    author: "",
    description: "",
    SPN_NO: "",
    quantity: 0,
    price: 0,
    image: ""
  });
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAllBooks = async () => {
    try {
      const booksList = await getAllBooks();
      setBooks(booksList);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAllBooks();
  }, [showAddPopup]);

  // For non-admin booking (decrement quantity)
  const handleBook = async (book: Book) => {
    if (book.quantity > 0) {
      const updatedBook = { ...book, quantity: book.quantity - 1 };
      try {
        await updateBook(book?.id, updatedBook);
        fetchAllBooks();
        navigate(`/dashboard/bookings/new`, {
          state: { bookDetail: updatedBook, user: currentUser }
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("This book is out of stock");
    }
  };

  const handleAddBook = async () => {
    if (newBook) {
      try {
        await createBook(newBook);
        setShowAddPopup(false);
        // Reset newBook for next use
        setNewBook({ id: 0, name: "", author: "", description: "", SPN_NO: "", quantity: 0, price: 0, image: "" });
        fetchAllBooks();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleUpdateBook = async () => {
    if (editBook) {
      try {
        await updateBook(editBook.id, editBook);
        fetchAllBooks();
        setShowEditPopup(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteBook = async () => {
    if (showDeletePopup !== null) {
      try {
        await deleteBook(showDeletePopup);
        fetchAllBooks();
        setShowDeletePopup(null);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Handle file selection and convert to Base64
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit && editBook) {
          setEditBook({ ...editBook, image: reader.result as string });
        } else {
          setNewBook({ ...(newBook as Book), image: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Add Book Button (visible for Admins) */}
      {currentUser?.isAdmin && (
        <div className="sticky top-0 bg-white shadow-md p-4  flex justify-end">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => setShowAddPopup(true)}
          >
            Add New Book
          </button>
        </div>
      )}

      <h1 className="text-2xl font-semibold mb-4">Books List</h1>
      <input
        type="text"
        placeholder="Search by name or author"
        className="w-full border px-3 py-2 mb-4 rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr>
              <th className="p-4 text-left">Id</th>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Author</th>
              <th className="p-4 text-left">SPN_NO</th>
              <th className="p-4 text-right">Quantity</th>
              <th className="p-4 text-right">Price</th>
              {currentUser?.isAdmin && <th className="p-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length > 0 ?
              filteredBooks.map((book) => (
                <tr key={book.id} className="border-t">
                  <td className="p-4">{book.id}</td>
                  <td className="p-4">
                    {book.image ? (
                      <img src={book.image} alt={book.name} className="w-16 h-16 object-cover" />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td className="p-4">{book.name}</td>
                  <td className="p-4">{book.author}</td>
                  <td className="p-4">{book.SPN_NO}</td>
                  <td className="p-4 text-center">{book.quantity}</td>
                  <td className="p-4 text-center">${book.price}</td>
                  <td className="p-4 text-right">
                    {!currentUser?.isAdmin && (
                      <button
                        disabled={book.quantity === 0}
                        onClick={() => handleBook(book)}
                        className={`${book.quantity === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
                          } text-white px-3 py-1 rounded mr-2`}
                      >
                        {book.quantity === 0 ? "Out of Stock" : "Book"}
                      </button>
                    )}
                    {currentUser?.isAdmin && (
                      <>
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                          onClick={() => {
                            setEditBook(book);
                            setShowEditPopup(true);
                          }}
                        >
                          Update
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded"
                          onClick={() => setShowDeletePopup(book.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
              :
              <tr className='text-center flex items-center justify-center'>No Book found !</tr>
              }
          </tbody>
        </table>
      </div>

      {/* Add Book Popup */}
      {showAddPopup && newBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add Book</h2>
            <input
              type="text"
              placeholder="Book Name"
              className="w-full border px-3 py-2 mb-4 rounded"
              value={newBook.name}
              onChange={(e) => setNewBook({ ...newBook, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Author"
              className="w-full border px-3 py-2 mb-4 rounded"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            />
            <input
              type="text"
              placeholder="description"
              className="w-full border px-3 py-2 mb-4 rounded"
              value={newBook.description}
              onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
            />
            <input
              type="text"
              placeholder="SPN_NO"
              className="w-full border px-3 py-2 mb-4 rounded"
              value={newBook.SPN_NO}
              onChange={(e) => setNewBook({ ...newBook, SPN_NO: e.target.value })}
            />
            <input
              type="number"
              placeholder="Quantity"
              className="w-full border px-3 py-2 mb-4 rounded"
              value={newBook.quantity || ""}
              onChange={(e) => setNewBook({ ...newBook, quantity: parseInt(e.target.value, 10) })}
            />
            <input
              type="number"
              placeholder="Price"
              className="w-full border px-3 py-2 mb-4 rounded"
              value={newBook.price || ""}
              onChange={(e) => setNewBook({ ...newBook, price: parseFloat(e.target.value) })}
            />
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Select Image:</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileSelect(e)} />
              {newBook.image && (
                <img src={newBook.image} alt="Preview" className="mt-2 w-32 h-32 object-cover" />
              )}
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setShowAddPopup(false)}
              >
                Cancel
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleAddBook}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Book Popup */}
      {showEditPopup && editBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Book</h2>
            <input
              type="text"
              placeholder="Book Name"
              className="w-full border px-3 py-2 mb-4 rounded"
              value={editBook.name}
              onChange={(e) => setEditBook({ ...editBook, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Author"
              className="w-full border px-3 py-2 mb-4 rounded"
              value={editBook.author}
              onChange={(e) => setEditBook({ ...editBook, author: e.target.value })}
            />
            <input
              type="text"
              placeholder="SPN_NO"
              className="w-full border px-3 py-2 mb-4 rounded"
              value={editBook.SPN_NO}
              onChange={(e) => setEditBook({ ...editBook, SPN_NO: e.target.value })}
            />
            <input
              type="number"
              placeholder="Quantity"
              className="w-full border px-3 py-2 mb-4 rounded"
              value={editBook.quantity || ""}
              onChange={(e) => setEditBook({ ...editBook, quantity: parseInt(e.target.value, 10) })}
            />
            <input
              type="number"
              placeholder="Price"
              className="w-full border px-3 py-2 mb-4 rounded"
              value={editBook.price || ""}
              onChange={(e) => setEditBook({ ...editBook, price: parseFloat(e.target.value) })}
            />
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Select Image:</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileSelect(e, true)} />
              {editBook.image && (
                <img src={editBook.image} alt="Preview" className="mt-2 w-32 h-32 object-cover" />
              )}
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setShowEditPopup(false)}
              >
                Cancel
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleUpdateBook}>
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this book?</p>
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setShowDeletePopup(null)}
              >
                Cancel
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleDeleteBook}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksList;
