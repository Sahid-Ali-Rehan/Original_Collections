import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
  
        if (token) {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          const userId = decodedToken?.id;
  
          if (userId) {
            // Fetch user info
            const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
  
            if (response.data.user) {
              setUser(response.data.user);
            }
  
            // Fetch orders for the logged-in user
            const ordersResponse = await axios.get('http://localhost:5000/api/orders/user-orders', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setOrders(ordersResponse.data.orders);
          }
        }
  
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">My Profile</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Orders</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left border-b">Order ID</th>
                <th className="px-4 py-2 text-left border-b">Status</th>
                <th className="px-4 py-2 text-left border-b">Estimated Delivery</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-4 py-2 border-b">{order._id}</td>
                  <td className="px-4 py-2 border-b">{order.status}</td>
                  <td className="px-4 py-2 border-b">{order.estimatedDeliveryDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
