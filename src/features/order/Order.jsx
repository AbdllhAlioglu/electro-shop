import React from "react";
import OrderSummaryItem from "./OrderSummaryItem";
import { useLoaderData } from "react-router-dom";
import {
  calculateRemainingTime,
  formatCurrency,
  formatDateTime,
} from "../../utils/helpers";
import { getOrder } from "../../services/productService"; // getOrder burada yer alıyor

function Order() {
  const order = useLoaderData();

  const {
    id,
    priority: expressDelivery,
    cart: items,
    deliveryTime = Date.now() + 30 * 60 * 1000,
  } = order;

  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const timeLeft = deliveryTime ? calculateRemainingTime(deliveryTime) : 0;

  return (
    <div className="space-y-8 px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Order Details #{id}</h2>

        <div className="space-x-2">
          {expressDelivery && (
            <span className="rounded-full bg-blue-500 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-blue-50">
              Express
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 bg-gray-200 px-6 py-5">
        <p className="font-medium">
          {timeLeft >= 0
            ? `Estimated arrival in ${timeLeft} minutes 🚚`
            : "Order should have arrived by now"}
        </p>
        <p className="text-xs text-gray-500">
          (Delivery expected: {formatDateTime(deliveryTime)})
        </p>
      </div>

      <ul className="divide-gray-200 divide-y border-b border-t">
        {items.map((item) => (
          <OrderSummaryItem item={item} key={item.id} />
        ))}
      </ul>

      <div className="space-y-2 bg-gray-200 px-6 py-5">
        <p className="text-sm font-medium text-gray-600">
          Total items price: {formatCurrency(totalAmount)}
        </p>
        <p className="font-bold">
          Amount to pay: {formatCurrency(totalAmount)}
        </p>
      </div>
    </div>
  );
}

export async function loader({ params }) {
  const order = await getOrder(params.orderId);
  return order;
}

export default Order;
