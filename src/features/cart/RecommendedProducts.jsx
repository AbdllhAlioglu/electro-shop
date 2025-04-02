import React from "react";
import RecommendedItem from "./RecommendedItem";
import { getMenu } from "../../services/productService";
import { useLoaderData } from "react-router-dom";

export default function RecommendedProducts() {
  const menu = useLoaderData();

  // Rastgele 3 ürün seçme
  const randomProducts = menu
    .sort(() => 0.5 - Math.random()) // Menüdeki ürünleri karıştır
    .slice(0, 3); // İlk 3 ürünü al

  return (
    <div className="mt-8">
      {/* Başlık */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Önerilen Ürünler
      </h2>

      {/* Ürünler Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {randomProducts.map((product) => (
          <RecommendedItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export async function loader() {
  const menu = await getMenu();
  return menu;
}
