import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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

  const handleDownload = (order) => {
    const worksheetData = [
      ["Order ID", order._id],
      ["Customer Name", order.name || "N/A"],
      ["Phone", order.phone || "N/A"],
      ["Address", order.address || "N/A"],
      ["Jela", order.jela || "N/A"],
      ["Upazela", order.upazela || "N/A"],
      ["Payment Method", order.paymentMethod || "N/A"],
      ["Status", order.status || "N/A"],
      ["Total Amount", `TK. ${order.totalAmount}`],
      [],
      ["Items", "Size", "Color", "Quantity", "Price"]
    ];

    order.items.forEach(item => {
      worksheetData.push([
        item.productName || "Unknown Product",
        item.selectedSize || "N/A",
        item.selectedColor || "N/A",
        item.quantity,
        `TK. ${item.price}`
      ]);
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
    worksheet["!cols"] = [
      { wch: 25 }, { wch: 20 }, { wch: 15 }, 
      { wch: 15 }, { wch: 15 }
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Order Details");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `Order_${order._id.slice(-6)}.xlsx`);
  };


  // Add this function inside the AllOrders component
const handleApproveCancellation = async (orderId) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(
      `https://original-collections.onrender.com/api/orders/cancel/${orderId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success("Order cancelled and deleted");
    setOrders(orders.filter(order => order._id !== orderId));
  } catch (error) {
    toast.error("Failed to approve cancellation");
    console.error(error);
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
                <th className="p-3 border-b text-left">Download</th>
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
                    <td className="p-3 border-b">
                      <button
                        onClick={() => handleDownload(order)}
                        className="bg-green-600 text-white px-4 py-2 rounded shadow-lg hover:bg-green-700 flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Excel
                      </button>
                    </td>

                    
                  </tr>
                  
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-4 text-secondary">No orders available</td>
                </tr>
              )}

{/* // Add new column in table header */}
<th className="p-3 border-b text-left">Actions</th>

{/* // Add new cell in table row */}
<td className="p-3 border-b">
  {order.status === "CancellationRequested" && (
    <button
      onClick={() => handleApproveCancellation(order._id)}
      className="bg-red-500 text-white px-4 py-2 rounded shadow-lg hover:bg-red-600"
    >
      Approve Cancellation
    </button>
  )}
</td>
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
                <p><strong>Jela:</strong> {selectedOrder.jela}</p>
                <p><strong>Upazela:</strong> {selectedOrder.upazela}</p>
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