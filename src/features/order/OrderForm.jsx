import React from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/productService"; // createOrder fonksiyonu
import Button from "../../ui/Button"; // Button bileşeni
import { useSelector } from "react-redux";
import { getCart } from "../cart/cartSlice"; // Redux'taki cart selector

// Telefon numarası doğrulama regex
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

function OrderForm() {
  const userName = useSelector((state) => state.user.userName);
  const cart = useSelector(getCart);

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const formErrors = useActionData();

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let’s go!</h2>

      {/* React Router Form */}
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
            <input
              className="input w-full"
              type="text"
              name="address"
              required
            />
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
          {/* Redux'tan gelen cart bilgisini gizli input ile gönderiyoruz */}
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

  // Sipariş nesnesini oluştur
  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "on", // Checkbox kontrolü
  };

  console.log(order);

  // Hataları kontrol et
  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      "Please provide a valid phone number. We might need to contact you.";

  if (Object.keys(errors).length > 0) return errors;

  // Eğer hata yoksa, siparişi oluştur
  try {
    const newOrder = await createOrder(order); // API çağrısı
    return redirect(`/order/${newOrder.id}`); // Başarılıysa yönlendir
  } catch (err) {
    console.error("Order creation failed:", err);
    return { error: "Order creation failed. Please try again." };
  }
}

export default OrderForm;
