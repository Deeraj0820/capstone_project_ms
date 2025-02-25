import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import exp from "constants";
// import popularBooks from "./PopularBooks";
import { getAllBooks } from "../utils/books.ts";

// Updated book object for the main detail section
const books = [
  {
    title: "Origin",
    author: "Dan Brown",
    category: "Thriller/Suspense",
    rating: "4.5",
    total: 100,
    available: 42,
    image:
      "https://avibrantpalette.com/wp-content/uploads/2019/08/BookReview_Origin.png",
  },
];

// Updated popular books array


export function NavBar() {
  return (
    <nav className="flex sticky z-[50] top-0 justify-between items-center px-10 py-5 bg-white shadow-md">
      <h1 className="text-xl font-bold text-black">📖 BookLibrary</h1>
      <div className="space-x-6 font-semibold text-[#0b5c71]">
        <Link to="/" className="hover:text-[#169fd5]">
          Home
        </Link>
        <Link to="/library" className="hover:text-[#169fd5]">
          Books
        </Link>
        <Link to="/contact" className="hover:text-[#169fd5]">
          Contact
        </Link>
        <Link to="/login" className="hover:text-[#169fd5]">
          Login
        </Link>
      </div>
    </nav>
  );
}

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [popularBooks, setPopularBooks] = useState([])

  const navigate = useNavigate();

  const fetchAllPopulars = async () =>{
    try{
      const response = await getAllBooks();
      setPopularBooks(response)
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    fetchAllPopulars();
  },[])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % popularBooks.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + popularBooks.length) % popularBooks.length
    );
  };

  // Using the first book from the books array for the main details section
  const book = books[0];

  return (
    <div>
      <NavBar />
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto py-10 px-4">
        {/* Book Detail Section */}
        <section className="bg-white p-8 rounded-lg shadow-lg mb-12 flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-4xl font-bold">{book.title}</h2>
            <p className="text-gray-600 mt-2">
              By {book.author} | Category: {book.category}
            </p>
            <div className="flex items-center gap-2 text-yellow-500 mt-4">
              <FaStar size={20} />
              <span className="text-xl font-semibold">{book.rating}/5</span>
            </div>
            <p className="text-gray-700 mt-2">
              Total Books: <span className="font-semibold">{book.total}</span> |{" "}
              Available: <span className="font-semibold">{book.available}</span>
            </p>
            <p className="text-gray-600 mt-4">
            Edmond, a tech billionaire and futurist, has made a shocking scientific discovery that he believes will answer humanity's most profound questions about the origin of life and the nature of the universe.
            </p>
            <button onClick={()=>navigate('/login')} className="mt-6 px-6 py-3 bg-[#0b5c71] text-white font-semibold rounded-md hover:bg-[#169fd5] transition-colors">
              📖 Borrow Book Request
            </button>
          </div>
          <div className="flex-shrink-0">
            <img
              src={book.image}
              alt={book.title}
              className="w-64 h-80 object-cover rounded-lg shadow-lg"
            />
          </div>
        </section>

        {/* Popular Books Carousel */}
        <section>
          <h3 className="text-3xl font-bold mb-6">Popular Books</h3>
          <div className="relative">
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md hover:bg-gray-200 p-3 rounded-full"
            >
              <IoIosArrowBack size={24} />
            </button>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {popularBooks.map((book, index) => (
                <Link
                  to={`/book/${book?.id}`}
                  key={index}
                  className="w-48 flex-shrink-0"
                >
                  <div
                    className={`bg-white rounded-xl p-4 shadow-md transition-transform duration-300 ${
                      index === currentIndex ? "scale-105" : "opacity-80"
                    } hover:opacity-100`}
                  >
                    <img
                      src={book?.image}
                      alt={book.title}
                      className="w-full h-56 object-cover rounded-md"
                    />
                    <h4 className="mt-4 text-lg font-semibold">
                      {book?.name}
                    </h4>
                    <p className="text-sm text-gray-600">{book?.author}</p>
                  </div>
                </Link>
              ))}
            </div>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md hover:bg-gray-200 p-3 rounded-full"
            >
              <IoIosArrowForward size={24} />
            </button>
          </div>
        </section>
      </div>
    </div>
    </div>
  );
}
export default Home;