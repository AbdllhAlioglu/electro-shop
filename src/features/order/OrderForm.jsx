import React, { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/productService";
import Button from "../../ui/Button";
import { useSelector } from "react-redux";
import { getCart } from "../cart/cartSlice";
import { getAddress } from "../../services/adressService";

const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

function OrderForm() {
  const [address, setAddress] = useState("");
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);

  const userName = useSelector((state) => state.user.userName);
  const cart = useSelector(getCart);
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
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let’s go!</h2>

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

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
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

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "on",
  };

  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      "Please provide a valid phone number. We might need to contact you.";

  if (Object.keys(errors).length > 0) return errors;

  try {
    const newOrder = await createOrder(order);
    return redirect(`/order/${newOrder.id}`);
  } catch (err) {
    console.error("Order creation failed:", err);
    return { error: "Order creation failed. Please try again." };
  }
}

export default OrderForm;
