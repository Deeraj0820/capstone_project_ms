import React, { useState } from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

const BookDetail: React.FC = () => {
    const [quantity, setQuantity] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");


    const bookDetails = {
        title: "THE TOTAL MONEY MAKEOVER",
        author: "Dave Ramsey",
        published: "2019",
        price: 19.99,
        originalPrice: 24.99,
        rating: 5,
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut cursus metus aliquam eleifend mi.",
        image: "https://m.media-amazon.com/images/I/81eCiKyn8IL.jpg",
    };

    const filteredContent = bookDetails.title.toLowerCase().includes(searchQuery.toLowerCase());

    return (
        <div className="max-w-4xl mx-auto p-6 flex flex-col gap-8 justify-center items-center h-screen">
            {/* Search Box */}
            <input
                type="text"
                placeholder="Search..."
                className="w-full p-2 border rounded mb-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            {filteredContent && (
                <div className="flex gap-8">
                    {/* Book Image */}
                    <div className="w-1/3">
                        <img
                            src={bookDetails.image}
                            alt={bookDetails.title}
                            className="rounded-lg shadow-lg"
                        />
                    </div>

                    {/* Book Details */}
                    <div className="w-2/3">
                        <h1 className="text-2xl font-bold">{bookDetails.title}</h1>
                        <p className="text-gray-600">By: {bookDetails.author} | Published: {bookDetails.published}</p>

                        {/* Rating */}
                        <div className="flex items-center gap-2 my-2">

                            <div className="rating">
                                <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
                                <input
                                    type="radio"
                                    name="rating-2"
                                    className="mask mask-star-2 bg-orange-400"
                                    defaultChecked />
                                <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
                                <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
                                <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
                            </div>
                            <span className="text-sm text-blue-600 font-bold">POPULAR</span>
                        </div>

                        {/* Pricing */}
                        <div className="text-xl font-semibold">
                            <span className="text-red-500">${bookDetails.price}</span>
                            <span className="line-through text-gray-400 ml-2">${bookDetails.originalPrice}</span>
                        </div>

                        {/* Social Share */}
                        <div className="flex gap-4 my-4 text-gray-600">
                            <FaFacebookF />
                            <FaTwitter />
                            <FaInstagram />
                        </div>

                        {/* Buy Now Section */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center bg-purple-600 text-white px-6 py-2 rounded-lg cursor-pointer">
                                <FaShoppingCart/> BUY BOOK NOW
                            </div>
                            <div className="flex items-center border rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-2 bg-gray-200"
                                >
                                    -
                                </button>
                                <span className="px-4 py-2">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-4 py-2 bg-gray-200"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="mt-6 border-b">
                            <nav className="flex gap-6 text-gray-600 font-semibold">
                                <Link to="/" className="pb-2 ">BOOK SUMMARY</Link>

                            </nav>
                        </div>

                        {/* Tab Content */}
                        <p className="mt-4 text-gray-600">
                            {bookDetails.description}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookDetail;
