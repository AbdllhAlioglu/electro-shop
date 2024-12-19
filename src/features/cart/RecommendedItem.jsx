import React from "react";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "./cartSlice";

export default function RecommendedItem({ product }) {
  const { id, name, price, image } = product;

  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart.cart);

  const handleAddToCart = () => {
    const existingProduct = cart.find((product) => product.id === id);

    if (existingProduct) {
      dispatch(
        addToCart({
          ...existingProduct,
          quantity: existingProduct.quantity + 1,
        })
      );
    } else {
      dispatch(addToCart({ id, name, price, image, quantity: 1 }));
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded flex flex-col items-center gap-2">
      <img src={image} alt={name} className="w-24 h-24 object-contain mb-2" />
      <h3 className="text-lg font-medium">{name}</h3>
      <p className="text-customGreen-500 font-semibold">{price} ₺</p>
      <Button type="small" onClick={handleAddToCart}>
        Add to cart
      </Button>
    </div>
  );
}
