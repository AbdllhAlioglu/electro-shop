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
          Siparişler Yüklenemedi
        </h1>
        <p className="text-stone-500 mb-6">
          Sipariş verilerinizi yüklerken bir sorun oluştu. Lütfen daha sonra
          tekrar deneyin.
        </p>
        <Link
          to="/menu"
          className="text-sm bg-customGreen-500 text-white px-4 py-2 rounded-md hover:bg-customGreen-600 transition-colors"
        >
          Alışverişe Devam Et
        </Link>
      </div>
    );
  }

  if (!orders.length) {
    console.log("No orders found to display");
    return (
      <div className="p-8 text-center">
        <h1 className="mb-4 text-xl font-semibold text-stone-700">
          Sipariş Bulunamadı
        </h1>
        <p className="text-stone-500 mb-6">Henüz hiç sipariş vermediniz.</p>
        <Link
          to="/menu"
          className="text-sm bg-customGreen-500 text-white px-4 py-2 rounded-md hover:bg-customGreen-600 transition-colors"
        >
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-gray-800">Siparişlerim</h1>

      <div className="grid grid-cols-1 gap-6">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/order/${order.id}`}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow-md"
          >
            <div className="flex flex-wrap justify-between gap-2 mb-4 pb-4 border-b border-gray-100">
              <div>
                <span className="text-sm text-gray-500">Sipariş No:</span>
                <p className="font-semibold text-gray-800">
                  #{order.id.slice(0, 8)}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Sipariş Tarihi:</span>
                <p className="font-medium">
                  {formatDateTime(order.created_at)}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Toplam Tutar:</span>
                <p className="font-semibold text-customGreen-700">
                  {formatCurrency(order.discountedTotal || order.totalPrice)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Teslimat Adresi:</span>
                <p className="text-gray-700 truncate max-w-xs">
                  {order.address}
                </p>
              </div>

              <div className="flex gap-2 items-center">
                {order.priority && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    Hızlı Teslimat
                  </span>
                )}
                <span className="inline-flex items-center rounded-md bg-customGreen-50 px-2 py-1 text-xs font-medium text-customGreen-700 ring-1 ring-inset ring-customGreen-600/20">
                  Detayları Görüntüle
                </span>
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
