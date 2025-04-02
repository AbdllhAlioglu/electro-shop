import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import { getAllOrders } from "../../services/orderService";
import { formatCurrency, formatDateTime } from "../../utils/helpers";

function Orders() {
  const orders = useLoaderData();
  console.log("Orders loaded:", orders);

  // discount price

  // Sipariş verilerini kontrol et
  if (!orders) {
    console.warn("Orders data is undefined");
    return (
      <div className="p-8 text-center">
        <h1 className="mb-4 text-xl font-semibold text-stone-700">
          Error Loading Orders
        </h1>
        <p className="text-stone-500 mb-6">
          There was a problem loading your order data. Please try again later.
        </p>
        <Link
          to="/menu"
          className="text-sm bg-customGreen-500 text-white px-4 py-2 rounded-md hover:bg-customGreen-600 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (!orders.length) {
    console.log("No orders found to display");
    return (
      <div className="p-8 text-center">
        <h1 className="mb-4 text-xl font-semibold text-stone-700">
          No Orders Found
        </h1>
        <p className="text-stone-500 mb-6">
          You haven&apos;t placed any orders yet.
        </p>
        <Link
          to="/menu"
          className="text-sm bg-customGreen-500 text-white px-4 py-2 rounded-md hover:bg-customGreen-600 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 md:px-12 lg:px-16 bg-gray-50">
      <h1 className="text-2xl font-semibold text-blue-800 mb-8">Your Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => {
          // Cart kontrolü
          if (!order.cart) {
            console.warn(`Order ${order.id} has no cart property`);
            order.cart = [];
          }

          // Calculate total price
          const totalPrice = order.cart.reduce(
            (sum, item) => sum + (item.totalPrice || 0),
            0
          );

          return (
            <Link
              to={`/order/${order.id}`}
              key={order.id}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Order #</span>
                    <span className="font-medium text-blue-800 ml-2">
                      {order.id}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDateTime(order.created_at)}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Items: </span>
                    <span className="font-medium">
                      {order.cart.length}{" "}
                      {order.cart.length === 1 ? "item" : "items"}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Total: </span>
                    <span className="font-medium text-customGreen-700">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                  {order.priority && (
                    <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-blue-50 uppercase">
                      Express
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 flex items-center justify-end text-sm text-blue-600">
                <span>View Details</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 ml-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export async function loader() {
  try {
    console.log("Orders loader starting...");
    const orders = await getAllOrders();
    console.log("Orders loader finished, data:", orders);
    return orders;
  } catch (error) {
    console.error("Error in orders loader:", error);
    // Boş array döndür ki sayfa yüklenirken hata oluşmasın
    return [];
  }
}

export default Orders;
