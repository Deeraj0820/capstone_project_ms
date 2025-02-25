import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
// import popularBooks from "./PopularBooks"; 
import { getAllBooks } from "../utils/books.ts";
import { NavBar } from "./Homepage.tsx";

const AllBooks = () => {
  const [popularBooks, setPopularBooks] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState(popularBooks);
  const [loading, setLoading] = useState(false)

  const location = useLocation();

  const fetchAllPopulars = async () => {
    setLoading(true)
    try {
      const response = await getAllBooks();
      // console.log(response)
      setPopularBooks(response)
      setFilteredBooks(response)
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllPopulars();
  }, [])

  // Filter the popularBooks based on the search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBooks(popularBooks);
    } else {
      const filtered = popularBooks.filter((book) =>
        book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (book?.category && book?.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredBooks(filtered);
    }
  }, [searchTerm]);

    // const location = useLocation();
  

  return (
    <>
      {
        location.pathname !== "/dashboard/library" &&
        <NavBar />
      }
      <div className="bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          {/* <Link to="/" className="text-blue-600 hover:text-blue-800 mb-4 block">
          Back to Home Page
        </Link> */}
          <h1 className="text-4xl font-bold text-center mb-10 mt-3">All Books</h1>

          {/* Sticky Search Field */}
          <div className="sticky top-0 z-20 bg-gray-100 pb-4">
            <div className="flex justify-center mb-4">
              <input
                type="text"
                placeholder="Search for books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full max-w-md"
              />
            </div>
          </div>

          {/* Books Grid with Scrollbar */}
          <div className="overflow-y-auto" style={{ maxHeight: "70vh" }}>
            {filteredBooks.length > 0 ?
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {
                  filteredBooks.map((book, index) => (
                    <Link
                      key={index}
                      to={location.pathname === '/dashboard/library' ? `/dashboard/book/${book?.id}` :`/book/${book?.id}`}
                      className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
                    >
                      <img
                        src={book?.image}
                        alt={book.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="p-4">
                        <h2 className="text-xl font-semibold mb-2">{book?.name}</h2>
                        <p className="text-gray-600">{book?.author}</p>
                        <p className="text-gray-500 mt-1 text-sm">{book?.category}</p>
                      </div>
                    </Link>
                  ))
                }
          </div>
          :
          loading ?
          <div className="text-center flex-col text-[grey] w-[100%] text-xl font-semibold flex gap-3 items-center justify-center py-5">Loading...</div>
          :
          <div className='text-center flex-col text-[grey] w-[100%] text-xl font-semibold flex gap-3 items-center justify-center py-5'>
            No Book found
            <span className='text-lg'>try another book...</span>
          </div>
          }
          </div>
        </div>
      </div>
    </>
  );
};

export default AllBooks;

