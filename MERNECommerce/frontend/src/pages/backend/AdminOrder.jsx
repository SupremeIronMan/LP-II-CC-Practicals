import React, { useEffect, useState } from "react";
import axios from "axios";
import Backend from "../../layout/Backend";

function AdminOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Backend>
      <div className="p-4 md:p-6 space-y-6">
        {/* ================= HEADER ================= */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
          <p className="text-sm text-gray-500">
            View and manage customer orders
          </p>
        </div>

        {/* ================= STATES ================= */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="text-gray-500 animate-pulse">
              Loading orders...
            </span>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-gray-500">
            No orders found.
          </div>
        ) : (
          /* ================= TABLE ================= */
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3 text-left">Order ID</th>
                    <th className="px-6 py-3 text-left">Customer</th>
                    <th className="px-6 py-3 text-left">Phone</th>
                    <th className="px-6 py-3 text-left">Total</th>
                    <th className="px-6 py-3 text-left">Payment</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 font-mono text-gray-700">
                        #{order._id.slice(-6)}
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800">
                          {order.customer.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.customer.email}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-gray-700">
                        {order.customer.phone}
                      </td>

                      <td className="px-6 py-4 font-semibold text-gray-800">
                        ${order.totalAmount}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-lg
                          bg-yellow-100 px-3 py-1 text-xs font-semibold
                          text-yellow-700">
                          {order.paymentStatus}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-lg
                          bg-blue-100 px-3 py-1 text-xs font-semibold
                          text-blue-700">
                          {order.orderStatus}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Backend>
  );
}

export default AdminOrder;
