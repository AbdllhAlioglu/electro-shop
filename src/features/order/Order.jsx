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
    <div className="bg-white px-6 py-10 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Sipariş #{id.slice(0, 5)}</h1>
          <div className="text-sm text-gray-500">
            {formatDateTime(order.created_at)}
          </div>
        </div>

        <div className="space-y-1">
          {expressDelivery && (
            <span className="bg-red-500 text-white inline-block rounded-full px-3 py-1 text-sm font-medium">
              Hızlı Teslimat
            </span>
          )}
          {timeLeft > 0 && (
            <div className="bg-customGreen-100 text-customGreen-800 inline-block rounded-full px-3 py-1 text-sm">
              <span className="font-semibold">{timeLeft} dakika</span> içinde
              teslim edilecek
            </div>
          )}
        </div>
      </div>

      <div className="border-b pb-5 mb-8">
        <h2 className="font-semibold text-lg mb-4">Sipariş Detayları</h2>
        {/* Order Items */}
        <ul className="divide-y divide-gray-200">
          {items.map((item) => (
            <OrderSummaryItem key={item.id + item.name} item={item} />
          ))}
        </ul>
      </div>

      <div className="mb-10">
        <h2 className="font-semibold text-lg mb-4">Teslimat Adresi</h2>
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
          <p className="font-medium text-gray-700">{order.customer}</p>
          <p className="text-gray-600 mt-1">{order.address}</p>
          <p className="text-gray-600 mt-1">{order.phone}</p>
        </div>
      </div>

      <section className="bg-gray-100 p-6 rounded-lg shadow-sm">
        <div className="flex flex-wrap justify-between gap-4">
          <p className="text-sm font-medium text-gray-600">
            Ürünlerin toplam fiyatı:
          </p>
          <p className="text-lg font-bold">{formatCurrency(totalPrice)}</p>
        </div>

        {/* Discount varsa göster */}
        {discount > 0 && (
          <div className="mt-3 mb-3">
            <div className="flex flex-wrap justify-between gap-4 text-customGreen-600">
              <p className="text-sm font-medium">İndirim ({discount}%):</p>
              <p className="text-lg font-bold">
                -{formatCurrency(totalPrice - finalPrice)}
              </p>
            </div>

            <div className="w-full h-0.5 bg-gray-200 my-3"></div>
          </div>
        )}

        <div className="flex flex-wrap justify-between gap-4 mt-2">
          <p className="text-sm font-medium text-gray-600">Ödenecek tutar:</p>
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
