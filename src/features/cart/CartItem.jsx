import Button from "../../ui/Button";
import { formatCurrency } from "../../utils/helpers";
import { useDispatch } from "react-redux";
import { removeFromCart } from "./cartSlice";
import { increaseItemQuantity } from "./cartSlice";
import { decreaseItemQuantity } from "./cartSlice";
import React from "react";

function CartItem({ item }) {
  const { id, name, quantity, totalPrice, image } = item;
  const dispatch = useDispatch();

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
      <img
        src={image}
        alt={name}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <p className="mb-1 sm:mb-0">
        {quantity}&times; {name}
      </p>
      <div className="flex items-center justify-between sm:gap-6">
        <p className="text-sm font-bold">{formatCurrency(totalPrice)}</p>
        <Button type="small" onClick={handleIncreaseItem}>
          +
        </Button>
        <Button type="small" onClick={handleDecreaseItem}>
          -
        </Button>
        <Button type="small" onClick={handleDeleteItem}>
          Delete
        </Button>
      </div>
    </li>
  );
}

export default CartItem;
