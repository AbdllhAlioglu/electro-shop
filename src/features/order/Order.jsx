import React, { useEffect } from "react";
import OrderSummaryItem from "./OrderSummaryItem";
import { useLoaderData } from "react-router-dom";
import {
  calculateRemainingTime,
  formatCurrency,
  formatDateTime,
} from "../../utils/helpers";
import { getOrder } from "../../services/orderService";
import { useSelector, useDispatch } from "react-redux";
import { resetOrderCreated } from "./orderSlice";
import toast from "react-hot-toast";

function Order() {
  const order = useLoaderData();
  const dispatch = useDispatch();
  const { orderCreated, currentOrderId } = useSelector((state) => state.order);

  // Veriyi kontrol et
  console.log("Order data loaded:", order);

  // Eğer order.cart tanımlanmamışsa, boş bir array olarak ayarla
  if (!order.cart) {
    console.warn("Order.cart is undefined, setting to empty array");
    order.cart = [];
  }

  // Sipariş başarıyla oluşturulduğunda toast bildirimini göster
  useEffect(() => {
    console.log("Order component useEffect - Redux state:", {
      orderCreated,
      currentOrderId,
      orderId: order.id,
    });

    if (orderCreated && currentOrderId === order.id) {
      console.log("Showing success toast notification!");
      // Toast bildirimi göster
      toast.success("Siparişiniz başarıyla oluşturuldu!");
      // Bildirimi sıfırla (tekrar göstermeyi engelle)
      dispatch(resetOrderCreated());
    }
  }, [orderCreated, currentOrderId, order.id, dispatch]);

  const {
    id,
    priority: expressDelivery,
    cart: items = [],
    deliveryTime = Date.now() + 30 * 60 * 1000,
    discount = 0,
    discountedTotal = 0,
  } = order;

  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const finalPrice = discount > 0 ? discountedTotal : totalPrice;
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
          <div className="mt-3 mb-3">
            <div className="flex flex-wrap justify-between gap-4 text-customGreen-600">
              <p className="text-sm font-medium">Discount ({discount}%):</p>
              <p className="text-lg font-bold">
                -{formatCurrency(totalPrice - finalPrice)}
              </p>
            </div>

            <div className="w-full h-0.5 bg-gray-200 my-3"></div>
          </div>
        )}

        <div className="flex flex-wrap justify-between gap-4 mt-2">
          <p className="text-sm font-medium text-gray-600">Amount to pay:</p>
          <p className="text-xl font-bold text-blue-800">
            {formatCurrency(finalPrice)}
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
