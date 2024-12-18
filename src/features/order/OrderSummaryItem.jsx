import React from "react";

import { formatCurrency } from "../../utils/helpers";

function OrderSummaryItem({ item }) {
  const { name, quantity, price, image } = item;

  return (
    <li className="flex justify-between py-4">
      <div className="flex items-center">
        <img src={image} alt={name} className="w-16 h-16 object-cover mr-4" />
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-gray-500">Quantity: {quantity}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium">{formatCurrency(price)}</p>
        <p className="text-sm text-gray-500">
          Total: {formatCurrency(price * quantity)}
        </p>
      </div>
    </li>
  );
}

export default OrderSummaryItem;
