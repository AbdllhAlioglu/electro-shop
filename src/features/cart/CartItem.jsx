import Button from "../../ui/common/Button";
import { formatCurrency } from "../../utils/helpers";
import { useDispatch } from "react-redux";
import { removeFromCart } from "./cartSlice";
import { increaseItemQuantity } from "./cartSlice";
import { decreaseItemQuantity } from "./cartSlice";
import React from "react";

function CartItem({ item, discount }) {
  const { id, name, quantity, totalPrice, image } = item;
  const dispatch = useDispatch();

  const discountedPrice = totalPrice * (1 - discount / 100);

  const handleDeleteItem = () => {
    dispatch(removeFromCart(id));
  };

  const handleIncreaseItem = () => {
    dispatch(increaseItemQuantity(id));
  };

  const handleDecreaseItem = () => {
    if (quantity === 1) {
      dispatch(removeFromCart(id));
      return;
    }
    dispatch(decreaseItemQuantity(id));
  };

  return (
    <li className="py-3 sm:flex sm:items-center sm:justify-between">
      <div className="flex-shrink-0 w-20 h-20 overflow-hidden rounded-lg bg-gray-50 border border-gray-100">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain p-1"
        />
      </div>
      <p className="mb-1 sm:mb-0">
        {quantity}&times; {name}
      </p>
      <div className="flex items-center justify-between sm:gap-6">
        <p className="text-sm font-bold">{formatCurrency(discountedPrice)}</p>
        <Button type="small" onClick={handleIncreaseItem}>
          +
        </Button>
        <Button type="small" onClick={handleDecreaseItem}>
          -
        </Button>
        <Button type="small" onClick={handleDeleteItem}>
          Sil
        </Button>
      </div>
    </li>
  );
}

export default CartItem;
