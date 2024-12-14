import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            setError('User not authenticated.');
            setLoading(false);
            return;
          }
      
          const response = await axios.get('https://ruhana.onrender.com/api/orders/all-orders', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          console.log(response.data);  // Check the structure of the data being returned
          setOrders(response.data);  // Use this only once
      
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch orders.');
        } finally {
          setLoading(false);
        }
      };
      
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const response = await axios.put(
        `https://ruhana.onrender.com/api/orders/update-status/${orderId}`,
        { status }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: response.data.status } : order
        )
      );
      toast.success("Order status updated successfully");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Error updating order status");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-[#faeed5]">
      <h1 className="text-3xl font-bold mb-6 text-[#8d5c51]">All Orders</h1>

      {loading ? (
        <p className="text-center text-[#996a6c]">Loading orders...</p>
      ) : (
        <div>
          <table className="min-w-full bg-[#f4ebb4] border border-[#a0926c] shadow-lg rounded-lg">
            <thead>
              <tr className="bg-[#bb9e8c] text-white">
                <th className="p-3 border-b text-left">Order ID</th>
                <th className="p-3 border-b text-left">Name</th>
                <th className="p-3 border-b text-left">Items</th>
                <th className="p-3 border-b text-left">Total Amount</th>
                <th className="p-3 border-b text-left">Status</th>
                <th className="p-3 border-b text-left">View More</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#ceba98]">
                    <td className="p-3 border-b">{order._id}</td>
                    <td className="p-3 border-b">{order.name || "No name"}</td>
                    <td className="p-3 border-b">
                      {order.items?.length > 0
                        ? order.items.map((item, index) => (
                            <div key={index}>
                              {item.productId?.productName || "Unknown product"} 
                              ({item.selectedSize}, {item.selectedColor})
                            </div>
                          ))
                        : "No items"}
                    </td>
                    <td className="p-3 border-b">TK. {order.totalAmount}</td>
                    <td className="p-3 border-b">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="border p-2 rounded bg-[#afb48a] text-[#7b7c4d] shadow-sm"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirm">Confirm</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="p-3 border-b">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="bg-[#8d5c51] text-white px-4 py-2 rounded shadow-lg"
                      >
                        View More
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-[#996a6c]">No orders available</td>
                </tr>
              )}
            </tbody>
          </table>

          {selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-[#f4ebb4] rounded-lg p-6 w-3/4 shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-[#8d5c51]">Order Details</h2>
                <div className="mb-4">
                  <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                  <p><strong>Name:</strong> {selectedOrder.name}</p>
                  <p><strong>Email:</strong> {selectedOrder.email}</p>
                  <p><strong>Phone:</strong> {selectedOrder.phone}</p>
                  <p><strong>Address:</strong> {selectedOrder.address}, {selectedOrder.upazela}, {selectedOrder.jela}, {selectedOrder.state}</p>
                  <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                  <p><strong>Status:</strong> {selectedOrder.status}</p>
                  <p><strong>Items:</strong></p>
                  <ul className="list-disc ml-6">
                    {selectedOrder.items.map((item, index) => (
                      <li key={index}>
                        {item.productName} - {item.quantity} x TK. {item.price} ({item.selectedSize}, {item.selectedColor})
                        <br />
                        <strong>Product Code:</strong> {item.productCode || "N/A"}
                      </li>
                    ))}
                  </ul>
                  <p><strong>Total Amount:</strong> TK. {selectedOrder.totalAmount}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="bg-[#996a6c] text-white px-4 py-2 rounded shadow-lg"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllOrders;
