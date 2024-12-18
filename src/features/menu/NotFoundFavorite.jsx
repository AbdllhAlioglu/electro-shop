import React from "react";
import Button from "../../ui/Button";

export default function NotFoundFavorite() {
  return (
    <div className="mx-auto my-24 flex flex-col items-center justify-center gap-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Favori Ürünler</h1>
      <p className="text-center text-gray-600">Favori ürün bulunamadı.</p>
      <Button type="small" to="/menu">
        Continue Ordering
      </Button>
    </div>
  );
}
