import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import { getAllOrders } from "../../services/orderService";
import { formatCurrency, formatDateTime } from "../../utils/helpers";

function Orders() {
  const orders = useLoaderData();

  // Siparişlerin array olup olmadığını kontrol et (veri yoksa veya array değilse)
  if (!orders || !Array.isArray(orders) || orders.length === 0) {
    return (
      <div className="py-10 px-4 text-center">
        <h2 className="text-xl font-semibold mb-4">
          Henüz hiç siparişiniz yok!
        </h2>
        <p className="text-gray-500 mb-8">
          Menüden favori ürünlerinizi seçerek sipariş verebilirsiniz.
        </p>
        <Link
          to="/menu"
          className="bg-customGreen-500 text-white px-6 py-3 rounded-full font-medium hover:bg-customGreen-600 transition-colors"
        >
          Menüye Git
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 lg:px-8">
      <h2 className="text-xl font-semibold mb-6">Sipariş Geçmişiniz</h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <Link
            to={`/order/${order.id}`}
            key={order.id}
            className="block p-4 sm:p-6 bg-white rounded-lg border border-gray-200 transition-shadow hover:shadow-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2 md:mb-4">
              <p className="font-medium">Sipariş #{order.id.slice(0, 5)}</p>
              <time
                dateTime={order.created_at}
                className="text-sm text-gray-500"
              >
                {formatDateTime(order.created_at)}
              </time>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="space-x-2">
                {order.priority && (
                  <span className="inline-block bg-red-100 text-red-800 py-1 px-3 text-xs sm:text-sm font-medium rounded-full">
                    Hızlı Teslimat
                  </span>
                )}
                <span className="inline-block bg-blue-100 text-blue-800 py-1 px-3 text-xs sm:text-sm font-medium rounded-full">
                  {(order.cart || []).reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  )}{" "}
                  Ürün
                </span>
              </div>
              <div className="font-medium text-customGreen-700">
                {formatCurrency(order.discounted_total || order.total || 0)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export async function loader() {
  try {
    const orders = await getAllOrders();
    return orders;
  } catch (error) {
    return [];
  }
}

export default Orders;
