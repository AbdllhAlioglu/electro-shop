import React from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/helpers";
import { useSelector } from "react-redux";

export default function CartOverview() {
  const totalCartQuantity = useSelector((state) =>
    state.cart.cart.reduce((acc, item) => acc + item.quantity, 0)
  );
  const totalCartPrice = useSelector((state) =>
    state.cart.cart.reduce((acc, item) => acc + item.totalPrice, 0)
  );
  const discount = useSelector((state) => state.cart.discount);
  const discountedPrice = totalCartPrice * (1 - discount / 100);
  return (
    <div className="flex items-center justify-between bg-stone-800 px-4 py-4 text-sm uppercase text-stone-200 sm:px-6 md:text-base">
      <p className="space-x-4 font-semibold text-stone-300 sm:space-x-6 lowercase">
        <span>{totalCartQuantity} ürün </span>
        <span>{formatCurrency(discountedPrice)}</span>
      </p>
      <Link to="/cart">Sepeti Aç &rarr;</Link>
    </div>
  );
}
