import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { formatCurrency } from "../../utils/helpers";
import { useSelector, useDispatch } from "react-redux";
import { FaShoppingCart, FaTrash } from "react-icons/fa";
import { clearCart } from "../cart/cartSlice";

export default function CartOverview() {
  const [isAnimating, setIsAnimating] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const cart = useSelector((state) => state.cart.cart);
  const totalCartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartPrice = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const discount = useSelector((state) => state.cart.discount);
  const discountedPrice = totalCartPrice * (1 - discount / 100);

  // Check if current path is menu page
  const isMenuPage =
    location.pathname === "/menu" || location.pathname === "/menu/";

  // Trigger animation when cart changes
  useEffect(() => {
    if (totalCartQuantity > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 800);
      return () => clearTimeout(timer);
    }
  }, [cart, totalCartQuantity]);

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  // Don't render if cart is empty or not on menu page
  if (totalCartQuantity === 0 || !isMenuPage) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 shadow-lg">
      <div
        className={`flex items-center justify-between bg-stone-800/90 backdrop-blur-sm px-3 py-2.5 text-xs uppercase sm:px-4 sm:text-sm ${
          isAnimating ? "bg-customGreen-600/90" : "bg-stone-800/90"
        } transition-colors duration-500`}
      >
        <div className="flex items-center">
          <FaShoppingCart
            className={`mr-2 text-sm ${
              isAnimating ? "animate-bounce text-white" : "text-stone-300"
            }`}
          />
          <p className="space-x-2 font-medium text-stone-300 lowercase">
            <span>{totalCartQuantity} ürün</span>
            <span className="hidden sm:inline">•</span>
            <span className="font-semibold text-white">
              {formatCurrency(discountedPrice)}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearCart}
            className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
            aria-label="Sepeti Temizle"
            title="Sepeti Temizle"
          >
            <FaTrash className="text-xs" />
            <span className="hidden sm:inline text-xs">Temizle</span>
          </button>

          <Link
            to="/cart"
            className="flex items-center gap-1 bg-customGreen-500 px-3 py-1.5 rounded hover:bg-customGreen-600 transition-colors text-white text-xs"
          >
            Sepeti Aç &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
