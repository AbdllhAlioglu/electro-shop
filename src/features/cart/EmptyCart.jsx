import { Link } from "react-router-dom";
import React from "react";

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 text-center">
      {/* Back to Menu Link */}
      <Link
        to="/menu"
        className="text-lg text-blue-500 hover:text-blue-600 hover:underline"
      >
        &larr; Ürünlere Dön
      </Link>

      {/* Empty Cart Message */}
      <p className="flex h-24 items-center justify-center rounded-lg text-xl font-bold text-gray-700">
        Sepetiniz henüz boş. Hemen ürün eklemeye başlayın :)
      </p>
    </div>
  );
}

export default EmptyCart;
