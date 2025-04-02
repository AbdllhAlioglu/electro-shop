import React, { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/orderService";
import Button from "../../ui/Button";
import { useSelector } from "react-redux";
import { getCart } from "../cart/cartSlice";
import { getAddress } from "../../services/adressService";
import toast from "react-hot-toast";
import store from "../../store";
import { orderCreatedSuccess } from "./orderSlice";
import { formatCurrency } from "../../utils/helpers";

// Benzersiz ID oluştur
function createOrderId() {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")}`;
}

const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

function OrderForm() {
  const [address, setAddress] = useState("");
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);

  const userName = useSelector((state) => state.user.userName);
  const cart = useSelector(getCart);
  const discount = useSelector((state) => state.cart.discount);

  // Toplam fiyat hesaplama
  const totalCartPrice = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const discountedPrice = totalCartPrice * (1 - discount / 100);

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const formErrors = useActionData();

  const handleGetLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsFetchingAddress(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await getAddress({ latitude, longitude });
          setAddress(data.locality || data.city || "Address not found");
        } catch (error) {
          console.error("Error fetching address:", error);
          alert("Failed to fetch your address. Please try again.");
        } finally {
          setIsFetchingAddress(false);
        }
      },
      () => {
        alert("Failed to get your location.");
        setIsFetchingAddress(false);
      }
    );
  };

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">
        Ready to order? Let&apos;s go!
      </h2>

      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            className="input grow"
            type="text"
            name="customer"
            required
            defaultValue={userName}
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone Number</label>
          <div className="grow">
            <input className="input w-full" type="tel" name="phone" required />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <div className="relative w-full">
              <input
                className="input w-full pr-32 sm:pr-36 md:pr-40 lg:pr-44"
                type="text"
                name="address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <button
                type="button"
                onClick={handleGetLocation}
                className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 bg-customGreen-200 px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base lg:text-lg text-white hover:customGreen-300 focus:outline-none focus:ring focus:ring-customGreen-200 focus:ring-offset-2 rounded-full w-1/4 sm:w-1/5 lg:w-1/6"
                disabled={isFetchingAddress}
              >
                {isFetchingAddress ? "Fetching..." : "Locate"}
              </button>
            </div>
          </div>
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
          />
          <label htmlFor="priority" className="font-medium">
            Want to give your order priority?
          </label>
        </div>

        {/* Sipariş Özeti */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-3">Order Summary</h3>

          <div className="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span>{formatCurrency(totalCartPrice)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between mb-2 text-customGreen-600">
              <span>Discount ({discount}%):</span>
              <span>-{formatCurrency(totalCartPrice - discountedPrice)}</span>
            </div>
          )}

          <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
            <span>Total:</span>
            <span>{formatCurrency(discountedPrice)}</span>
          </div>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input type="hidden" name="discount" value={discount} />
          <input type="hidden" name="discountedTotal" value={discountedPrice} />
          <Button disabled={isSubmitting} type="primary">
            {isSubmitting ? "Placing order..." : "Order Now"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  // Validation
  const errors = {};
  if (!isValidPhone(data.phone))
    errors.phone =
      "Please provide a valid phone number. We might need to contact you.";

  if (Object.keys(errors).length > 0) return errors;

  // Create order object with unique ID
  const order = {
    id: createOrderId(),
    customer: data.customer,
    phone: data.phone,
    address: data.address,
    cart: JSON.parse(data.cart),
    priority: data.priority === "on",
    discount: Number(data.discount) || 0,
    discountedTotal: Number(data.discountedTotal) || 0,
  };

  try {
    // Send order to Supabase
    const newOrder = await createOrder(order);
    console.log("Order successfully created with ID:", newOrder.id);

    // Dispatch success action to Redux - will trigger toast in Order component
    console.log("Dispatching orderCreatedSuccess action with ID:", newOrder.id);
    store.dispatch(orderCreatedSuccess(newOrder.id));

    // Clear cart in Redux store handled in createOrder function

    // Redirect to order detail page
    return redirect(`/order/${newOrder.id}`);
  } catch (err) {
    console.error("Order creation failed:", err);

    // For errors, we can show toast directly as we're not redirecting
    toast.error("Sipariş oluşturulamadı: " + err.message);

    return { error: "Order creation failed. Please try again." };
  }
}

export default OrderForm;
