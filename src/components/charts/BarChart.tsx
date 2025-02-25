import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { getMonthlyRevenuewithMonthName } from "../../utils/bookings.ts"; 

// Register the necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Monthly Revenue",
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June"];

const BarChart = () => {
  const [revenueData, setRevenueData] = useState<number[]>([]); // State to hold revenue for each month

  useEffect(() => {
    // Function to fetch monthly revenue for each month
    const fetchRevenueData = async () => {
      const totalRevenue = await Promise.all(
        labels.map(async (month, index) => {
          // Assuming `getMonthlyRevenue` takes a month and returns the revenue for that month
          const revenue = await getMonthlyRevenuewithMonthName(month); 
          return revenue.totalRevenue || 0;
        })
      );

      setRevenueData(totalRevenue); // Set the revenue data in state
    };

    fetchRevenueData(); // Fetch the revenue data when the component mounts
  }, []);

  const data = {
    labels,
    datasets: [
      {
        label: "Revenue",
        data: revenueData, // Use dynamic data here
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <Bar options={options} data={data} />
    </div>
  );
};

export default BarChart;
