import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart, applyDiscount } from "./cartSlice";
import LinkButton from "../../ui/LinkButton";
import Button from "../../ui/Button";
import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";
import RecommendedProducts from "./RecommendedProducts";

function Cart() {
  const userName = useSelector((state) => state.user.userName);
  const cart = useSelector((state) => state.cart.cart);
  const discount = useSelector((state) => state.cart.discount);
  const dispatch = useDispatch();

  const [coupon, setCoupon] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleApplyCoupon = () => {
    if (coupon === "Alioğlu") {
      dispatch(applyDiscount(20)); // %20 indirim uygula
      alert("Coupon applied! You got a 20% discount.");
      setIsCouponApplied(true);
      setCoupon("");
    } else {
      alert("Invalid coupon code.");
      setIsCouponApplied(false);
    }
  };

  if (!cart.length) return <EmptyCart />;
  return (
    <div className="px-4 py-3">
      <LinkButton to="/menu">&larr; Back to menu</LinkButton>

      <h2 className="mt-7 text-xl font-semibold">Your cart, {userName}</h2>

      <ul className="mt-3 divide-y divide-stone-200 border-b">
        {cart.map((item) => (
          <CartItem item={item} key={item.id} discount={discount} />
        ))}
      </ul>

      <div className="mt-6 flex flex-col items-end gap-4">
        <input
          type="text"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          placeholder="Enter coupon code"
          disabled={isCouponApplied}
          className="border p-2 rounded input"
        />
        {!isCouponApplied ? (
          <Button
            type="small"
            onClick={handleApplyCoupon}
            disabled={isCouponApplied}
          >
            Apply Coupon
          </Button>
        ) : (
          <Button type="primary" disabled={isCouponApplied}>
            Applied Coupon
          </Button>
        )}
      </div>

      <div className="mt-6 space-x-2">
        <Button to="/order/new" type="primary">
          Order
        </Button>
        <Button type="secondary" onClick={handleClearCart}>
          Clear cart
        </Button>
      </div>
      <RecommendedProducts />
    </div>
  );
}

export default Cart;
