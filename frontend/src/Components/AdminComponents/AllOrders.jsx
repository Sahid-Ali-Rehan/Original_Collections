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
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "https://original-collections.onrender.com/api/orders/all-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(response.data);
      } catch (err) {
        toast.error("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const response = await axios.put(
        `https://original-collections.onrender.com/api/orders/update-status/${orderId}`,
        { status }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: response.data.status } : order
        )
      );
      toast.success("Order status updated successfully");
    } catch (error) {
      toast.error("Error updating order status");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-[#D7F4FA]">
      <h1 className="text-3xl font-bold mb-6 text-primary">All Orders</h1>
      {loading ? (
        <p className="text-center text-secondary">Loading orders...</p>
      ) : (
        <div>
          <table className="min-w-full bg-white border border-muted shadow-lg rounded-lg">
            <thead>
              <tr className="bg-primary text-white">
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
                  <tr key={order._id} className="hover:bg-secondary">
                    <td className="p-3 border-b">{order._id}</td>
                    <td className="p-3 border-b">{order.name || "No name"}</td>
                    <td className="p-3 border-b">
                      {order.items?.length > 0
                        ? order.items.map((item, index) => (
                            <div key={index}>
                              {item.productName || "Unknown product"} ({item.selectedSize}, {item.selectedColor})
                            </div>
                          ))
                        : "No items"}
                    </td>
                    <td className="p-3 border-b">TK. {order.totalAmount}</td>
                    <td className="p-3 border-b">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="border p-2 rounded bg-muted text-black shadow-sm"
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
                        className="bg-primary text-white px-4 py-2 rounded shadow-lg"
                      >
                        View More
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-secondary">No orders available</td>
                </tr>
              )}
            </tbody>
          </table>

          {selectedOrder && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-3/4 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-primary">Order Details</h2>
      <p><strong>Order ID:</strong> {selectedOrder._id}</p>
      <p><strong>Name:</strong> {selectedOrder.name}</p>
      <p><strong>Phone:</strong> {selectedOrder.phone}</p>
      <p><strong>Address:</strong> {selectedOrder.address}</p>
      <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
      <p><strong>Status:</strong> {selectedOrder.status}</p>
      <p><strong>Jela:</strong> {selectedOrder.jela}</p> {/* Added field */}
      <p><strong>Upazela:</strong> {selectedOrder.upazela}</p> {/* Added field */}
      <p><strong>Items:</strong></p>
      <ul className="list-disc ml-6">
        {selectedOrder.items.map((item, index) => (
          <li key={index}>
            {item.productName} - {item.quantity} x TK. {item.price} ({item.selectedSize}, {item.selectedColor})
          </li>
        ))}
      </ul>
      <p><strong>Total Amount:</strong> TK. {selectedOrder.totalAmount}</p>
      <button
        onClick={() => setSelectedOrder(null)}
        className="bg-muted text-white px-4 py-2 rounded shadow-lg"
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
