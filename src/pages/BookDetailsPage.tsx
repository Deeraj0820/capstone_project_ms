// import React, { useState, useEffect } from "react"
// import { Link, useNavigate, useParams } from "react-router-dom";
// // import popularBooks from "./PopularBooks";
// import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
// import { NavBar } from "./Homepage.tsx";
// import { getaBook, getAllBooks } from "../utils/books.ts";

// function BookDetails() {
//   // Extract the "id" parameter from the URL.
//   const { id } = useParams();
//   const index = parseInt(id, 10);
//   const [popularBooks, setPopularBooks] = useState([])
//   const [book, setBook] = useState()

//   const navigate = useNavigate();


//   const fetchAllPopulars = async () => {
//     try {
//       const response = await getAllBooks();
//       // console.log(response)
//       setPopularBooks(response)
//       // setFilteredBooks(response)
//     } catch (err) {
//       console.log(err)
//     }
//   }

//   useEffect(() => {
//     fetchAllPopulars();
//   }, [])

//   // Local state to handle carousel index for the popular books slider on this page
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const currentUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

//   const nextSlide = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % popularBooks.length);
//   };

//   const prevSlide = () => {
//     setCurrentIndex(
//       (prevIndex) => (prevIndex - 1 + popularBooks.length) % popularBooks.length
//     );
//   };

//   useEffect(() => {
//     const fetchCurrentBook = async () => {
//       try {
//         const response = await getaBook(id);
//         console.log(response);
//         setBook(response)
//       } catch (err) {
//         console.log(err)
//       }
//     }
//     fetchCurrentBook();
//   }, [id])

//   if (!book) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <h2 className="text-3xl font-bold">Loading...</h2>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       <NavBar />
//       <div className="max-w-4xl mx-auto py-10 px-4">
//         {/* <Link to="/" className="text-blue-600 hover:underline">
//           &larr; Back to Home
//         </Link> */}

//         {/* Book Details Section */}
//         <div className="bg-white p-8 rounded-lg shadow-lg mt-6 flex flex-col md:flex-row items-center">
//           <div className="md:w-1/3">
//             <img
//               src={book?.image}
//               alt={book?.name}
//               className="w-full h-auto object-cover rounded-lg"
//             />
//           </div>
//           <div className="mt-6 md:mt-0 md:ml-8 md:w-2/3">
//             <h2 className="text-3xl font-bold mb-2">{book?.name}</h2>
//             <p className="text-gray-600 mb-2">By {book?.author}</p>
//             <p className="text-gray-600 mb-2">Price: $ {book?.price}</p>
//             <p className="text-gray-700 mt-4">
//               {book?.description}
//             </p>
//             <button className="mt-6 px-6 py-3 bg-[#0b5c71] text-white font-semibold rounded-md hover:bg-[#169fd5] transition-colors" onClick={() => navigate(`/dashboard/bookings/new`, {
//               state: { bookDetail: book, user: currentUser }
//             })}>
//             Borrow Book
//           </button>
//         </div>
//       </div>

//       {/* Popular Books Carousel */}
//       <section className="mt-12">
//         <h3 className="text-3xl font-bold mb-6">Popular Books</h3>
//         <div className="relative">
//           <button
//             onClick={prevSlide}
//             className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md hover:bg-gray-200 p-3 rounded-full"
//           >
//             <IoIosArrowBack size={24} />
//           </button>
//           <div className="flex gap-6 overflow-x-auto pb-4">
//             {popularBooks.map((book, idx) => (
//               <Link
//                 to={`/book/${book?.id}`}
//                 key={idx}
//                 className="w-48 flex-shrink-0"
//               >
//                 <div
//                   className={`bg-white rounded-xl p-4 shadow-md transition-transform duration-300 ${idx === currentIndex ? "scale-105" : "opacity-80"
//                     } hover:opacity-100`}
//                 >
//                   <img
//                     src={book.image}
//                     alt={book.title}
//                     className="w-full h-56 object-cover rounded-md"
//                   />
//                   <h4 className="mt-4 text-lg font-semibold">{book.title}</h4>
//                   <p className="text-sm text-gray-600">{book.category}</p>
//                 </div>
//               </Link>
//             ))}
//           </div>
//           <button
//             onClick={nextSlide}
//             className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md hover:bg-gray-200 p-3 rounded-full"
//           >
//             <IoIosArrowForward size={24} />
//           </button>
//         </div>
//       </section>
//     </div>
//     </div >
//   );
// }

// export default BookDetails;



import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward, IoMdClose } from "react-icons/io";
import { NavBar } from "./Homepage.tsx";
import { getaBook, getAllBooks } from "../utils/books.ts";
import { StarIcon } from "@heroicons/react/16/solid";
import { FaStar } from "react-icons/fa";
import { createReview, deleteReview, getReviewsByBook } from "../utils/reviews.ts";
import { MdDelete } from "react-icons/md";

function BookDetails() {
  const { id } = useParams();
  const index = parseInt(id, 10);
  const [popularBooks, setPopularBooks] = useState([]); // Array to store popular books
  const [book, setBook] = useState<any>(null); // State to store the current book
  const [showReviewPopup, setShowReviewPopup] = useState(false); // State to handle the review popup visibility
  const [newReview, setNewReview] = useState(""); // State for the new review input
  const [reviews, setReviews] = useState<any[]>([]);

  // console.log('rev', reviews)

  const navigate = useNavigate();
  const location = useLocation();


  // Fetch all popular books
  const fetchAllPopulars = async () => {
    try {
      const response = await getAllBooks();
      setPopularBooks(response);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAllReviews = async () =>{
    try{
      const resp = await getReviewsByBook(id);
      // console.log('revs', resp)
      setReviews(resp)
    }catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
    fetchAllPopulars();
  }, []);

  // Fetch the current book and its reviews
  useEffect(() => {
    const fetchCurrentBook = async () => {
      try {
        const response = await getaBook(id);
        setBook(response);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCurrentBook();
    fetchAllReviews();
  }, [id]);

  //   // Local state to handle carousel index for the popular books slider on this page
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentUser = JSON.parse(localStorage.getItem("adminUser") || "{}");


  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % popularBooks.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + popularBooks.length) % popularBooks.length);
  };


  // Function to handle adding a new review
  const handleAddReview = async () => {
    if (newReview.trim()) {
      const newReviewObj = {
        bookId:id,
        userName: currentUser?.displayName,
        reviewText: newReview,
        timestamp: Date.now()
      };
      try{
        await createReview(newReviewObj);
        // console.log(newRev)
        setNewReview(""); // Clear input field
        fetchAllReviews();
      }catch(err){
        console.log(err)
      }
    }
  };

  const handleDeleteRev = async (rev) =>{
    try{
      await deleteReview(rev?.id)
      fetchAllReviews();
    }catch(err){
      console.log(err)
    }
  }

  // console.log("thus",location?.pathname === 'dashboard/book/')

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-3xl font-bold">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {
        !location.pathname.includes('/dashboard/book/') &&
        <NavBar />
      }
      <div className="max-w-4xl mx-auto py-10 px-4">
        {/* Book Details Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg mt-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/3">
            <img
              src={book?.image}
              alt={book?.name}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
          <div className="mt-6 md:mt-0 md:ml-8 md:w-2/3">
            <h2 className="text-3xl font-bold mb-2">{book?.name}</h2>
            <p className="text-gray-600 mb-2">By {book?.author}</p>
            <p className="text-gray-600 mb-2">Price: $ {book?.price}</p>
            <p className="text-gray-700 mt-4">
              {book?.description}
            </p>
            <button
              className="mt-6 px-6 py-3 bg-[#0b5c71] text-white font-semibold rounded-md hover:bg-[#169fd5] transition-colors"
              onClick={() =>
                navigate(`/dashboard/bookings/new`, {
                  state: { bookDetail: book, user: currentUser },
                })
              }
            >
              Borrow Book
            </button>
            {/* Review Button */}
            <button
              className="mt-4 ml-2 px-6 py-3 bg-[#0b5c71] text-white font-semibold rounded-md hover:bg-[#169fd5] transition-colors"
              onClick={() =>
              {
                fetchAllReviews()
                setShowReviewPopup(true)
              }
              }
            >
              <p className='flex items-center justify-center gap-1'>Reviews <span className='text-[goldenrod]'><FaStar  /></span></p>
            </button>
          </div>
        </div>

        {/* Popular Books Carousel */}
        <section className="mt-12">
          <h3 className="text-3xl font-bold mb-6">Popular Books</h3>
          <div className="relative">
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md hover:bg-gray-200 p-3 rounded-full"
            >
              <IoIosArrowBack size={24} />
            </button>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {popularBooks.map((book, idx) => (
                <Link to={location.pathname.includes('/dashboard/book/') ? `/dashboard/book/${book?.id}` :`/book/${book?.id}`} key={idx} className="w-48 flex-shrink-0">
                  <div
                    className={`bg-white rounded-xl p-4 shadow-md transition-transform duration-300 ${idx === currentIndex ? "scale-105" : "opacity-80"
                      } hover:opacity-100`}
                  >
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-56 object-cover rounded-md"
                    />
                    <h4 className="mt-4 text-lg font-semibold">{book.title}</h4>
                    <p className="text-sm text-gray-600">{book.category}</p>
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

      {/* Review Popup */}
      {showReviewPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-[40%] h-[70vh] rounded-lg overflow-hidden relative">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowReviewPopup(false)}
            >
              <IoMdClose size={24} />
            </button>

            {/* Reviews List */}
            <div className="h-3/4 overflow-y-auto p-4">
              {reviews.length > 0 ? (
                reviews.map((review, idx) => (
                  <div key={idx} className="mb-4">
                    <p className="text-sm font-semibold">{review?.userName}</p>
                    <div className="flex items-center justify-between">
                    <p className="text-gray-600 w-[80%]">{review?.reviewText}</p>
                    {
                      currentUser?.isAdmin &&
                      <button className='text-xl text-[tomato]' onClick={()=>handleDeleteRev(review)}>
                      <MdDelete />
                    </button>
                    }
                    </div>
                  </div>
                ))
              )
              :
              (
                <p className="text-gray-500">No reviews yet.</p>
              ) 
            }
            </div>

            {/* Add New Review */}
            <div className="absolute bottom-0 w-full bg-gray-100 p-4">
              <textarea
                className="w-full p-2 mb-2 border rounded-md"
                placeholder="Write your review..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
              />
              <button
                className="w-full bg-[#0b5c71] text-white font-semibold rounded-md p-2"
                onClick={handleAddReview}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookDetails;

