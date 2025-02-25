// import React from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Line } from "react-chartjs-2";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const options = {
//   responsive: true,
//   plugins: {
//     legend: {
//       position: "top" as const,
//     },
//     title: {
//       display: true,
//       text: "User Growth",
//     },
//   },
// };

// const labels = ["January", "February", "March", "April", "May", "June"];

// const data = {
//   labels,
//   datasets: [
//     {
//       label: "Active Users",
//       data: [1000, 1500, 2000, 2500, 3000, 3500],
//       borderColor: "rgb(75, 192, 192)",
//       backgroundColor: "rgba(75, 192, 192, 0.5)",
//     },
//   ],
// };

// const LineChart = () => {
//   return (
//     <div className="bg-white p-4 rounded-lg shadow">
//       <Line options={options} data={data} />
//     </div>
//   );
// };

// export default LineChart;

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getUsersByMonth } from "../../utils/auth.util.ts";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Registering the necessary components from Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
      text: "Registered Users Growth (Monthly)",
    },
  },
};

const LineChart = () => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    // Get data for each month
    const fetchUserData = async () => {
      const months = ["January", "February", "March", "April", "May", "June"];
      const year = new Date().getFullYear(); // Get current year
      const userCounts = await Promise.all(
        months.map(async (month) => {
          const users = await getUsersByMonth(month, year);
          return users.length; // Count number of users for each month
        })
      );

      setChartData({
        labels: months,
        datasets: [
          {
            label: "Registered Users",
            data: userCounts,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.5)",
          },
        ],
      });
    };

    fetchUserData();
  }, []);

  if (!chartData) return <div>Loading...</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <Line options={options} data={chartData} />
    </div>
  );
};

export default LineChart;


