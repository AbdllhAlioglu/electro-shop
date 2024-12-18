import React from "react";
import Button from "../../ui/Button";

export default function RecommendedItem({ product }) {
  const { name, price, image } = product;

  return (
    <div className="p-4 bg-white shadow rounded flex flex-col items-center gap-2">
      <img src={image} alt={name} className="w-24 h-24 object-contain mb-2" />
      <h3 className="text-lg font-medium">{name}</h3>
      <p className="text-customGreen-500 font-semibold">{price} ₺</p>
      <Button type="small">Add to cart</Button>
    </div>
  );
}
