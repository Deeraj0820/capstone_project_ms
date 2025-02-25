import React, { useState, useEffect } from "react";
import { ref, set, push, get, child } from "firebase/database";
import { FDB } from "../config/firebase.ts"; // Import your Firebase configuration

// Sample data for demonstration
const contactData = [
    {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        message: "I have a question about my booking.",
        date: "2023-10-01",
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        message: "Can you help me with my account?",
        date: "2023-10-02",
    },
    {
        id: 3,
        name: "Alice Johnson",
        email: "alice@example.com",
        message: "I need assistance with a book return.",
        date: "2023-10-03",
    },
];

const ContactDetailsPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [contactDetails, setContactDetails] = useState<any[]>([]);

    const getAllContactDetails = async () => {
        try {
            const contactRef = ref(FDB, "contactDetails");
            const snapshot = await get(contactRef);

            if (snapshot.exists()) {
                const details = Object.values(snapshot.val());
                // console.log(details)
                setContactDetails(details); // Update state with all contact details
            } else {
                console.log("No contact details found.");
            }
        } catch (error) {
            console.error("Error fetching contact details:", error);
        }
    };

    useEffect(() => {
        getAllContactDetails();
    }, [])

    // Filter contact data based on search query
    const filteredContacts = contactDetails.filter(
        (contact) =>
            contact?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact?.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Contact Details</h1>

            {/* Search Bar */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by name, email, or message..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Contact Table */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="py-3">Name</th>
                            <th className="py-3">Email</th>
                            <th className="py-3">Message</th>
                            <th className="py-3">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredContacts.map((contact) => (
                            <tr key={contact.id} className="border-b hover:bg-gray-50">
                                <td className="py-4">{contact?.firstName} {contact?.lastName}</td>
                                <td className="py-4">{contact?.email}</td>
                                <td className="py-4">{contact?.message}</td>
                                <td className="py-4">{contact?.date ? new Date(contact?.date).toLocaleDateString() : ""}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ContactDetailsPage;