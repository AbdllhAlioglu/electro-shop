import React from "react";
import OrderSummaryItem from "./OrderSummaryItem";
import { useLoaderData } from "react-router-dom";
import {
  calculateRemainingTime,
  formatCurrency,
  formatDateTime,
} from "../../utils/helpers";
import { getOrder } from "../../services/productService";
import { useSelector } from "react-redux";

function Order() {
  const order = useLoaderData();
  const discount = useSelector((state) => state.cart.discount);
  const discountedPrice =
    order.cart.reduce((acc, item) => acc + item.totalPrice, 0) *
    (1 - discount / 100);

  const {
    id,
    priority: expressDelivery,
    cart: items,
    deliveryTime = Date.now() + 30 * 60 * 1000,
  } = order;
  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);
  // const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const timeLeft = deliveryTime ? calculateRemainingTime(deliveryTime) : 0;

  return (
    <div className="space-y-8 p-6 sm:p-8 md:px-12 lg:px-16 bg-gray-50">
      {/* Başlık */}
      <header className="flex flex-wrap items-center justify-between gap-4 bg-blue-100 px-4 py-3 rounded-lg shadow-sm">
        <h1 className="text-2xl font-semibold text-blue-800">
          Order Details <span className="text-blue-600">#{id}</span>
        </h1>
        {expressDelivery && (
          <span className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-blue-50 uppercase">
            Express Delivery
          </span>
        )}
      </header>

      {/* Tahmini Teslimat */}
      <section className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-lg font-medium text-gray-700">
            {timeLeft >= 0
              ? `Estimated arrival in ${timeLeft} minutes 🚚`
              : "Order should have arrived by now"}
          </p>
          <p className="text-sm text-gray-500">
            (Delivery expected: {formatDateTime(deliveryTime)})
          </p>
        </div>
      </section>

      {/* Sipariş Listesi */}
      <section className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Order Summary
        </h2>
        <ul className="divide-y divide-gray-200">
          {items.map((item) => (
            <OrderSummaryItem item={item} key={item.id} />
          ))}
        </ul>
      </section>

      {/* Toplam Ücret */}
      <section className="bg-gray-100 p-6 rounded-lg shadow-sm">
        <div className="flex flex-wrap justify-between gap-4">
          <p className="text-sm font-medium text-gray-600">
            Total items price:
          </p>
          <p className="text-lg font-bold">{formatCurrency(totalPrice)}</p>
        </div>

        {/* Discount varsa göster */}
        {discount > 0 && (
          <p className="text-stone-200 text-center my-4 font-extrabold bg-gradient-to-r from-customGreen-400 via-customGreen-200 to-stone-200 rounded-full p-2">
            {`${discount}% applied`}
          </p>
        )}

        <div className="flex flex-wrap justify-between gap-4 mt-2">
          <p className="text-sm font-medium text-gray-600">Amount to pay:</p>
          <p className="text-xl font-bold text-blue-800">
            {formatCurrency(discount > 0 ? discountedPrice : totalPrice)}
          </p>
        </div>
      </section>
    </div>
  );
}

export async function loader({ params }) {
  const order = await getOrder(params.orderId);
  return order;
}

export default Order;
