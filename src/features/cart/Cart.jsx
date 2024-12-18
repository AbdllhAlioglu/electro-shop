import LinkButton from "../../ui/LinkButton";
import Button from "../../ui/Button";
import CartItem from "./CartItem";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { clearCart } from "./cartSlice";
import EmptyCart from "./EmptyCart";
import React from "react";
import RecommendedProducts from "./RecommendedProducts";

function Cart() {
  const userName = useSelector((state) => state.user.userName);
  const cart = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  if (!cart.length) return <EmptyCart />;
  return (
    <div className="px-4 py-3">
      <LinkButton to="/menu">&larr; Back to menu</LinkButton>

      <h2 className="mt-7 text-xl font-semibold">Your cart, {userName}</h2>

      <ul className="mt-3 divide-y divide-stone-200 border-b">
        {cart.map((item) => (
          <CartItem item={item} key={item.key} />
        ))}
      </ul>

      <div className="mt-6 space-x-2">
        {cart.length > 0 && (
          <Button to="/order/new" type="primary">
            Order
          </Button>
        )}

        <Button type="secondary" onClick={handleClearCart}>
          Clear cart
        </Button>
      </div>
      <RecommendedProducts />
    </div>
  );
}

export default Cart;
