import React, { useEffect, useState } from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import Skeleton from 'react-loading-skeleton'; // Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Optional, to add default styles

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';

// Register necessary components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const DashboardStats = () => {
  const [donutData, setDonutData] = useState(null);  // Initially null to indicate loading
  const [lineData, setLineData] = useState(null);    // Initially null to indicate loading

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('https://original-collections.onrender.com/api/dashboard/stats');
        const data = await response.json();
        
        console.log("Fetched Data:", data);  // Debugging - check the structure of fetched data

        if (data) {
          const { orders, products, users, salesData } = data;

          setDonutData({
            labels: ['Orders', 'Products', 'Users'],
            datasets: [
              {
                data: [orders, products, users],
                backgroundColor: ['#bb9e8c', '#faeed5', '#996a6c'],
              },
            ],
          });

          setLineData({
            labels: salesData.months,
            datasets: [
              {
                label: 'Sales',
                data: salesData.values,
                borderColor: '#8d5c51',
                fill: true,
                backgroundColor: 'rgba(141, 92, 81, 0.2)',
              },
            ],
          });
        } else {
          console.error("No data returned from API.");
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  // Display skeleton loaders while fetching data
  if (!donutData || !lineData) {
    return (
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#afaf8a] p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Overview</h3>
          <Skeleton height={200} /> {/* Skeleton loader for the donut chart */}
        </div>
        <div className="bg-[#faeed5] p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Sales Trend</h3>
          <Skeleton height={200} /> {/* Skeleton loader for the line chart */}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-[#afaf8a] p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Overview</h3>
        <Doughnut data={donutData} />
      </div>
      <div className="bg-[#faeed5] p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Sales Trend</h3>
        <Line data={lineData} />
      </div>
    </div>
  );
};

export default DashboardStats;
