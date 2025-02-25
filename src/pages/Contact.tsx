// import { FaRocket } from "react-icons/fa";
// import React from "react"
// import { NavBar } from "./Homepage.tsx";

// const ContactForm:React.FC = () => {
//   return (
//     <section className=" text-white">
//       <NavBar />
//       <div className="max-w-5xl mx-auto ">
//         <h2 className="text-center text-4xl font-bold mt-4">
//           Get in <span className="text-[black]">Touch</span>
//         </h2>
//         <p className="text-center text-[gray] mt-2">
//           Reach out, and let's create a platform to help everyone together!
//         </p>

//         <div className=" mt-10 bg-[lightgrey] flex flex-col lg:flex-row  items-center justify-center rounded-2xl ">
//           {/* Form Section */}
//           <div className=" p-8  shadow-lg w-full lg:w-1/2">
//             <h3 className="text-xl text-[black] font-semibold">Let's connect constellations</h3>
//             <p className="text-[black] text-sm mb-6">
//               Let’s align our constellations! Reach out and let the magic of collaboration illuminate our skies.
//             </p>

//             <form className="space-y-4">
//               <div className="flex gap-4">
//                 <input
//                   type="text"
//                   placeholder="Last Name"
//                   className="w-1/2 px-4 py-3 rounded-md text-[black] outline-none focus:ring-2 focus:ring-purple-500"
//                 />
//                 <input
//                   type="text"
//                   placeholder="First Name"
//                   className="w-1/2 px-4 py-3 rounded-md text-[black] outline-none focus:ring-2 focus:ring-purple-500"
//                 />
//               </div>
//               <input
//                 type="email"
//                 placeholder="Email"
//                 className="w-full px-4 py-3 rounded-md text-[black] outline-none focus:ring-2 focus:ring-purple-500"
//               />
//               <input
//                 type="text"
//                 placeholder="Phone Number"
//                 className="w-full px-4 py-3 rounded-md text-[black] outline-none focus:ring-2 focus:ring-purple-500"
//               />
//               <textarea
//                 placeholder="Message"
//                 className="w-full px-4 py-3 rounded-md text-[black] outline-none focus:ring-2 focus:ring-purple-500 h-28"
//               ></textarea>

//               <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-md flex items-center justify-center gap-2 text-lg font-medium transition">
//                 Send Details <FaRocket />
//               </button>
//             </form>
//           </div>

//           {/* Image Section */}
//           <div className=" p-8  shadow-lg w-full lg:w-1/2 flex flex-col items-center text-center">
//             <img
//               src="https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Ym9va3N8ZW58MHx8MHx8fDA%3D"
//               alt="Astronaut"
//               className="rounded-lg shadow-lg h-96 w-full object-cover"
//             />
//             <p className="text-[black] mt-4 text-sm">
//               "Two lunar months revealed Earth's fragile beauty against vast silence, transforming my view of our place in the universe."
//             </p>
//             <span className="text-purple-300 text-sm font-medium mt-2">- Irinel Traista</span>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ContactForm;


import { FaRocket } from "react-icons/fa";
import React, { useState } from "react";
import { NavBar } from "./Homepage.tsx";
import { ref, set, push, get, child } from "firebase/database";
import { FDB } from "../config/firebase.ts";

const ContactForm: React.FC = () => {
  // State for storing form values
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    date:Date.now()
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission to send contact details to Firebase
  const sendContactDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const contactRef = ref(FDB, "contactDetails");
      const newContactRef = push(contactRef); // Generate a unique key for each submission

      // Save the form data to Firebase
      await set(newContactRef, formData);

      alert("Your contact details have been sent successfully!");

      // Clear the form after submission
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending contact details:", error);
      alert("There was an error while sending your details. Please try again.");
    }
  };

  return (
    <section className="text-white">
      <NavBar />
      <div className="max-w-5xl mx-auto ">
        <h2 className="text-center text-4xl font-bold mt-4">
          Get in <span className="text-[black]">Touch</span>
        </h2>
        <p className="text-center text-[gray] mt-2">
          Reach out, and let's create a platform to help everyone together!
        </p>

        <div className="mt-10 bg-[lightgrey] flex flex-col lg:flex-row items-center justify-center rounded-2xl">
          {/* Form Section */}
          <div className="p-8 shadow-lg w-full lg:w-1/2">
            <h3 className="text-xl text-[black] font-semibold">
              Let's connect constellations
            </h3>
            <p className="text-[black] text-sm mb-6">
              Let’s align our constellations! Reach out and let the magic of collaboration illuminate our skies.
            </p>

            <form onSubmit={sendContactDetails} className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-1/2 px-4 py-3 rounded-md text-[black] outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-1/2 px-4 py-3 rounded-md text-[black] outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-4 py-3 rounded-md text-[black] outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full px-4 py-3 rounded-md text-[black] outline-none focus:ring-2 focus:ring-purple-500"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                className="w-full px-4 py-3 rounded-md text-[black] outline-none focus:ring-2 focus:ring-purple-500 h-28"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-md flex items-center justify-center gap-2 text-lg font-medium transition"
              >
                Send Details <FaRocket />
              </button>
            </form>
          </div>

          {/* Image Section */}
          <div className="p-8 shadow-lg w-full lg:w-1/2 flex flex-col items-center text-center">
            <img
              src="https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Ym9va3N8ZW58MHx8MHx8fDA%3D"
              alt="Astronaut"
              className="rounded-lg shadow-lg h-96 w-full object-cover"
            />
            <p className="text-[black] mt-4 text-sm">
              "Two lunar months revealed Earth's fragile beauty against vast silence, transforming my view of our place in the universe."
            </p>
            <span className="text-purple-300 text-sm font-medium mt-2">- Irinel Traista</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;

