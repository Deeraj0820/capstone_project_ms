// import React, { useEffect, useState } from 'react';
// import { getMonthlyReminders } from '../utils/books.ts';
// import { getAllBookings } from '../utils/bookings.ts';

// // Interface for Reminder
// interface Reminder {
//     id: string;
//     message: string;
//     createdTime: string;
// }

// const Remainders = () => {
//     const currentUser = JSON.parse(localStorage.getItem("adminUser") || "{}");
//     const [reminders, setReminders] = useState<Reminder[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [bookings, setBookings] = useState<any[]>([]);

//     // Fetch all bookings for the current user
//     const fetchAllBookings = async () => {
//         try {
//             const response = await getAllBookings(currentUser);
//             setBookings(response);
//             // console.log(response)
//             console.log(response);
//         } catch (err) {
//             console.log(err);
//         }
//     };

//     // Function to create static reminders based on dateOfSubmit
//     const createStaticReminders = (bookings: any[]) => {
//         const now = new Date();
//         const reminders: Reminder[] = [];

//         bookings.forEach((booking) => {
//             const submitDate = new Date(booking.dateOfSubmit);
//             const timeDifference = submitDate.getTime() - now.getTime();
//             const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Calculate the difference in days

//             // Check if the book is due within 2 or fewer days
//             if (daysLeft <= 2 && daysLeft > 0) {
//                 // Generate a dynamic reminder with the number of days left
//                 const reminderMessage = `Only ${daysLeft} day${daysLeft > 1 ? "s" : ""} left to return the book: ${booking.bookName} by ${booking.author}`;
//                 reminders.push({
//                     id: booking.id, // Assuming id exists in the booking
//                     message: reminderMessage,
//                     createdTime: new Date().toISOString(),
//                 });
//             }
//         });

//         return reminders;
//     };

//     // Function to fetch monthly reminders from Firebase service
//     const fetchMonthlyReminders = async () => {
//         try {
//             setLoading(true);
//             const response = await getMonthlyReminders();
//             setReminders(response);
//         } catch (error) {
//             console.error('Error fetching reminders:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Fetch all bookings and monthly reminders when the component is mounted
//     useEffect(() => {
//         fetchAllBookings();
//         fetchMonthlyReminders();
//     }, []);

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <div className="text-xl text-blue-500">Loading...</div>
//             </div>
//         );
//     }

//     // Create static reminders from bookings (those due in 2 or fewer days)
//     const staticReminders = createStaticReminders(bookings);

//     // Combine both reminders (monthly and static), ensuring no duplication
//     const allReminders = [
//         ...reminders,
//         ...staticReminders.filter(
//             (staticReminder) =>
//                 !reminders.some((existingReminder) => existingReminder.id === staticReminder.id)
//         ),
//     ];

//     return (
//         <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
//             <h1 className="text-3xl font-bold text-center mb-6">Monthly Reminders</h1>

//             {/* Render Monthly Reminders */}
//             {allReminders.length > 0 && (
//                 <div className="space-y-4">
//                     {allReminders.map((reminder, index) => (
//                         <div
//                             key={index}
//                             className={`p-4 rounded-lg shadow-sm ${reminder.message.includes('Only') ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
//                                 } border-l-4 ${reminder.message.includes('Only') ? 'border-orange-500' : 'border-blue-500'}`}
//                         >
//                             <div className="font-semibold">{reminder.message}</div>
//                             <div className="text-sm text-gray-500 mt-2">
//                                 {new Date(reminder.createdTime).toLocaleDateString()}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* If no reminders are available */}
//             {allReminders.length === 0 && (
//                 <div className="text-center text-gray-500">No reminders found.</div>
//             )}
//         </div>
//     );
// };

// export default Remainders;




import React, { useEffect, useState } from 'react';
import { getMonthlyReminders } from '../utils/books.ts';
import { getAllBookings } from '../utils/bookings.ts';

// Interface for Reminder
interface Reminder {
    id: string;
    message: string;
    createdTime: string;
}

const Remainders = () => {
    const currentUser = JSON.parse(localStorage.getItem("adminUser") || "{}");
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [bookings, setBookings] = useState<any[]>([]);

    // Fetch all bookings for the current user
    const fetchAllBookings = async () => {
        try {
            const response = await getAllBookings(currentUser);
            setBookings(response);
            // console.log(response);
        } catch (err) {
            console.log(err);
        }
    };

    // Function to create static reminders based on dateOfSubmit
    const createStaticReminders = (bookings: any[]) => {
        const now = new Date();
        const reminders: Reminder[] = [];

        bookings.forEach((booking) => {
            const submitDate = new Date(booking.dateOfSubmit);
            const timeDifference = submitDate.getTime() - now.getTime();
            const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Calculate the difference in days

            // Handle the overdue case (0 days left)
            if (daysLeft === 0) {
                const reminderMessage = `Overdue! Please return or rerent the book: ${booking.bookName} by ${booking.author}`;
                reminders.push({
                    id: booking.id, // Assuming id exists in the booking
                    message: reminderMessage,
                    createdTime: new Date().toISOString(),
                });
            }

            // Check if the book is due within 2 or fewer days
            if (daysLeft <= 2 && daysLeft > 0) {
                // Generate a dynamic reminder with the number of days left
                const reminderMessage = `Only ${daysLeft} day${daysLeft > 1 ? "s" : ""} left to return the book: ${booking.bookName} by ${booking.author}`;
                reminders.push({
                    id: booking.id, // Assuming id exists in the booking
                    message: reminderMessage,
                    createdTime: new Date().toISOString(),
                });
            }
        });

        return reminders;
    };

    // Function to fetch monthly reminders from Firebase service
    const fetchMonthlyReminders = async () => {
        try {
            setLoading(true);
            const response = await getMonthlyReminders();
            setReminders(response);
        } catch (error) {
            console.error('Error fetching reminders:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch all bookings and monthly reminders when the component is mounted
    useEffect(() => {
        fetchAllBookings();
        fetchMonthlyReminders();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl text-blue-500">Loading...</div>
            </div>
        );
    }

    // Create static reminders from bookings (those due in 2 or fewer days)
    const staticReminders = createStaticReminders(bookings);

    // Combine both reminders (monthly and static), ensuring no duplication
    const allReminders = [
        ...reminders,
        ...staticReminders.filter(
            (staticReminder) =>
                !reminders.some((existingReminder) => existingReminder.id === staticReminder.id)
        ),
    ];

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-center mb-6">Monthly Reminders</h1>

            {/* Render Monthly Reminders */}
            {allReminders.length > 0 && (
                <div className="space-y-4">
                    {allReminders.map((reminder, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-lg shadow-sm ${reminder.message.includes('Overdue') ? 'bg-red-100 text-red-800' : (reminder.message.includes('Only') ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-gray-800') } border-l-4 ${reminder.message.includes('Overdue') ? 'border-red-500' : (reminder.message.includes('Only') ? 'border-orange-500' : 'border-blue-500')}`}
                        >
                            <div className="font-semibold">{reminder.message}</div>
                            <div className="text-sm text-gray-500 mt-2">
                                {new Date(reminder.createdTime).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* If no reminders are available */}
            {allReminders.length === 0 && (
                <div className="text-center text-gray-500">No reminders found.</div>
            )}
        </div>
    );
};

export default Remainders;



