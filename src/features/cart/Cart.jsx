import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart, applyDiscount, clearDiscount } from "./cartSlice";
import LinkButton from "../../ui/common/LinkButton";
import Button from "../../ui/common/Button";
import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";
import RecommendedProducts from "./RecommendedProducts";
import { formatCurrency } from "../../utils/helpers";
import { toast } from "react-hot-toast";

function Cart() {
  const userName = useSelector((state) => state.user.userName);
  const cart = useSelector((state) => state.cart.cart);
  const discount = useSelector((state) => state.cart.discount);
  const dispatch = useDispatch();

  const [coupon, setCoupon] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const totalCartPrice = useSelector((state) =>
    state.cart.cart.reduce((acc, item) => acc + item.totalPrice, 0)
  );
  const discountedPrice = totalCartPrice * (1 - discount / 100);

  const handleClearCart = () => {
    dispatch(clearCart());
    if (isCouponApplied) {
      dispatch(clearDiscount());
      setIsCouponApplied(false);
    }
  };

  const handleApplyCoupon = () => {
    if (coupon.trim().toLowerCase() === "alioğlu") {
      dispatch(applyDiscount(10));
      setIsCouponApplied(true);
      setCoupon("");
      toast.success("Kupon başarıyla uygulandı! %10 indirim kazandınız.");
    } else {
      toast.error("Geçersiz kupon kodu!");
      dispatch(clearDiscount());
      setIsCouponApplied(false);
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(clearDiscount());
    setIsCouponApplied(false);
    setCoupon("");
  };

  if (!cart.length) return <EmptyCart />;
  return (
    <div className="px-4 py-3">
      <LinkButton to="/menu">&larr; Ürünlere Dön</LinkButton>

      <h2 className="mt-7 text-xl font-semibold">Sepetiniz, {userName}</h2>

      <ul className="mt-3 divide-y divide-stone-200 border-b">
        {cart.map((item) => (
          <CartItem item={item} key={item.id} discount={discount} />
        ))}
      </ul>

      <div className="mt-6 flex justify-between items-center">
        <p className="text-lg font-semibold">
          {discount > 0 ? (
            <>
              <span className="text-gray-500 line-through mr-2">
                {formatCurrency(totalCartPrice)}
              </span>
              <span className="text-customGreen-600">
                {formatCurrency(discountedPrice)}
              </span>
            </>
          ) : (
            formatCurrency(totalCartPrice)
          )}
        </p>
        {discount > 0 && (
          <div className="px-3 py-1 bg-customGreen-50 text-customGreen-600 rounded-full text-sm font-medium">
            %{discount} indirim
          </div>
        )}
      </div>

      {/* Kupon bölümü */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium mb-2">İndirim Kuponu</p>
        <div className="flex items-end gap-2">
          <div className="flex-grow">
            <input
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder={
                isCouponApplied ? "Kupon uygulandı" : "Kupon kodu girin"
              }
              disabled={isCouponApplied}
              className="border p-2 rounded input w-full"
            />
          </div>

          {isCouponApplied ? (
            <Button
              type="small"
              onClick={handleRemoveCoupon}
              className="bg-red-100 text-red-600 hover:bg-red-200"
            >
              Kaldır
            </Button>
          ) : (
            <Button type="small" onClick={handleApplyCoupon}>
              Uygula
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6 space-x-2">
        <Button to="/order/new" type="primary">
          Sipariş Ver
        </Button>
        <Button type="secondary" onClick={handleClearCart}>
          Sepeti Temizle
        </Button>
      </div>
      <RecommendedProducts />
    </div>
  );
}

export default Cart;
