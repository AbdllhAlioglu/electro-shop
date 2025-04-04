import React, { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/orderService";
import Button from "../../ui/common/Button";
import { useSelector } from "react-redux";
import { getCart } from "../cart/cartSlice";
import { getAddress } from "../../services/addressService";
import toast from "react-hot-toast";
import store from "../../store";
import { orderCreatedSuccess } from "./orderSlice";
import { formatCurrency } from "../../utils/helpers";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

// Benzersiz ID oluştur
function createOrderId() {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")}`;
}

const isValidPhone = (str) =>
  /^(\+90|0)?[\s-]?\(?5[0-9]{2}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/.test(
    str
  );

function OrderForm() {
  const [address, setAddress] = useState("");
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [creditCard, setCreditCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    focus: "",
  });
  const [isPriority, setIsPriority] = useState(false);

  const userName = useSelector((state) => state.user.userName);
  const cart = useSelector(getCart);
  const discount = useSelector((state) => state.cart.discount);
  const user = useSelector((state) => state.user.user);

  // Toplam fiyat hesaplama
  const totalCartPrice = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const discountedPrice = totalCartPrice * (1 - discount / 100);
  const priorityFee = isPriority ? discountedPrice * 0.1 : 0;
  const finalPrice = discountedPrice + priorityFee;

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
          setAddress(
            data.locality + " " + data.countryName + " " + data.countryCode
          );
        } catch (error) {
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

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "expiry") {
      // Format expiry date with a slash after 2 digits (MM/YY)
      if (value.length === 2 && creditCard.expiry.length === 1) {
        setCreditCard((prev) => ({ ...prev, [name]: value + "/" }));
      } else if (value.length === 2 && !value.includes("/")) {
        setCreditCard((prev) => ({ ...prev, [name]: value + "/" }));
      } else {
        setCreditCard((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setCreditCard((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCardInputFocus = (e) => {
    setCreditCard((prev) => ({ ...prev, focus: e.target.name }));
  };

  const handlePriorityChange = (e) => {
    setIsPriority(e.target.checked);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-5 px-6">
        <h2 className="text-2xl font-bold text-white">
          Ödeme İşlemini Tamamlayın
        </h2>
        <p className="text-indigo-100">
          Siparişinizi güvenle tamamlamak için lütfen bilgilerinizi girin
        </p>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Teslimat Bilgileri
          </h3>
          <Form method="POST" className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Ad Soyad
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                type="text"
                name="customer"
                required
                defaultValue={userName}
                maxLength="50"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Telefon Numarası
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                type="tel"
                name="phone"
                required
                placeholder="05XX XXX XX XX"
                maxLength="13"
              />
              <p className="text-xs text-gray-500 mt-1">
                Örnek: 05XX XXX XX XX formatında giriniz (maksimum 11 karakter)
              </p>
              {formErrors?.phone && (
                <p className="mt-1 text-sm text-red-600">
                  Geçerli bir telefon numarası giriniz (5XX XXX XX XX)
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Adres
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  type="text"
                  name="address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  maxLength="200"
                />
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="absolute right-2 top-2 bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-sm font-medium hover:bg-indigo-200"
                  disabled={isFetchingAddress}
                >
                  {isFetchingAddress ? "Yükleniyor..." : "Konum Al"}
                </button>
              </div>
            </div>

            <div className="flex items-center mt-4">
              <input
                className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                type="checkbox"
                name="priority"
                id="priority"
                checked={isPriority}
                onChange={handlePriorityChange}
              />
              <label htmlFor="priority" className="ml-2 text-sm text-gray-700">
                Hızlı teslimat istiyorum (+10%)
              </label>
            </div>

            {/* Kredi Kartı Bilgileri - Hidden fields */}
            <input type="hidden" name="cart" value={JSON.stringify(cart)} />
            <input type="hidden" name="discount" value={discount} />
            <input type="hidden" name="discountedTotal" value={finalPrice} />
            <input type="hidden" name="userId" value={user?.id || ""} />
            <input type="hidden" name="cardNumber" value={creditCard.number} />
            <input type="hidden" name="cardName" value={creditCard.name} />
            <input type="hidden" name="cardExpiry" value={creditCard.expiry} />

            {/* Sipariş Özeti */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-base font-medium text-gray-800 mb-3">
                Sipariş Özeti
              </h3>

              <div className="flex justify-between mb-2 text-sm">
                <span>Ara Toplam:</span>
                <span>{formatCurrency(totalCartPrice)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between mb-2 text-sm text-green-600">
                  <span>İndirim ({discount}%):</span>
                  <span>
                    -{formatCurrency(totalCartPrice - discountedPrice)}
                  </span>
                </div>
              )}

              {isPriority && (
                <div className="flex justify-between mb-2 text-sm text-indigo-600">
                  <span>Hızlı Teslimat (+10%):</span>
                  <span>+{formatCurrency(priorityFee)}</span>
                </div>
              )}

              <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold text-lg">
                <span>Toplam:</span>
                <span>{formatCurrency(finalPrice)}</span>
              </div>
            </div>

            <div>
              <Button
                disabled={isSubmitting}
                type="primary"
                className="w-full mt-4"
              >
                {isSubmitting
                  ? "İşleminiz gerçekleştiriliyor..."
                  : "Ödemeyi Tamamla"}
              </Button>
            </div>
          </Form>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Ödeme Bilgileri
          </h3>

          <div className="mb-4">
            <Cards
              number={creditCard.number}
              name={creditCard.name}
              expiry={creditCard.expiry}
              cvc={creditCard.cvc}
              focused={creditCard.focus}
            />
          </div>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Kart Üzerindeki İsim
              </label>
              <input
                type="text"
                name="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="AD SOYAD"
                value={creditCard.name}
                onChange={handleCardInputChange}
                onFocus={handleCardInputFocus}
                maxLength="50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Kart üzerinde yazan ad ve soyadı birebir giriniz (maksimum 50
                karakter)
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Kart Numarası
              </label>
              <input
                type="text"
                name="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="**** **** **** ****"
                maxLength="16"
                value={creditCard.number}
                onChange={handleCardInputChange}
                onFocus={handleCardInputFocus}
              />
              <p className="text-xs text-gray-500 mt-1">
                16 haneli kart numarasını boşluk olmadan giriniz
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Son Kullanma Tarihi
                </label>
                <input
                  type="text"
                  name="expiry"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="AA/YY"
                  maxLength="5"
                  value={creditCard.expiry}
                  onChange={handleCardInputChange}
                  onFocus={handleCardInputFocus}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: AA/YY (Örn: 05/25)
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  CVC
                </label>
                <input
                  type="text"
                  name="cvc"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="***"
                  maxLength="3"
                  value={creditCard.cvc}
                  onChange={handleCardInputChange}
                  onFocus={handleCardInputFocus}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Kartın arkasındaki 3 haneli güvenlik kodu
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-md">
            <p className="text-sm">
              <span className="font-medium">Güvenli Ödeme:</span> Tüm ödeme
              bilgileri 256-bit SSL ile şifrelenir ve hiçbir şekilde kart
              bilgileriniz saklanmaz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  // Validation
  const errors = {};
  if (!isValidPhone(data.phone))
    errors.phone = "Geçerli bir telefon numarası giriniz (5XX XXX XX XX)";

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

    // Dispatch success action to Redux - will trigger toast in Order component
    store.dispatch(orderCreatedSuccess(newOrder.id));

    // Redirect to order detail page
    return redirect(`/order/${newOrder.id}`);
  } catch (err) {
    // For errors, we can show toast directly as we're not redirecting
    toast.error("Sipariş oluşturulamadı: " + err.message);

    return { error: "Order creation failed. Please try again." };
  }
}

export default OrderForm;
