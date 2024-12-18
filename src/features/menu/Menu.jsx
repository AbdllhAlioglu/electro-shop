import React, { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { getMenu } from "../../services/productService";
import MenuItem from "./MenuItem";
import SortMenu from "./SortMenu";
import SearchBar from "../../ui/SearchBar";
import NotFoundProduct from "./NotFoundProduct";

export default function Menu() {
  const menu = useLoaderData(); // Menü verisini al
  const [sortedMenu, setSortedMenu] = useState(menu); // Menü verisi, sıralanmış listeyi tutar
  const [searchTerm, setSearchTerm] = useState(""); // Arama terimini tutar
  const [filteredMenu, setFilteredMenu] = useState(menu); // Arama sonuçlarını tutan state

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const handleSortChange = (sortOption) => {
    const sorted = [...menu].sort((a, b) => {
      if (sortOption === "asc") {
        return a.price - b.price;
      } else if (sortOption === "desc") {
        return b.price - a.price;
      } else if (sortOption === "nameAsc") {
        return a.name.localeCompare(b.name);
      } else if (sortOption === "nameDesc") {
        return b.name.localeCompare(a.name);
      } else if (sortOption === "ratingAsc") {
        return a.rating - b.rating;
      } else if (sortOption === "ratingDesc") {
        return b.rating - a.rating;
      } else if (sortOption === "category") {
        return a.category.localeCompare(b.category);
      } else if (sortOption === "powerAsc") {
        return parseInt(a.power) - parseInt(b.power);
      } else if (sortOption === "powerDesc") {
        return parseInt(b.power) - parseInt(a.power);
      } else {
        return 0;
      }
    });
    setSortedMenu(sorted);
  };

  useEffect(() => {
    const filtered = sortedMenu.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMenu(filtered);
  }, [searchTerm, sortedMenu]); // searchTerm veya sortedMenu değiştiğinde tetiklenir

  return (
    <div className="px-4 py-6 h-screen">
      <div className="flex justify-around items-center mb-6 space-x-4">
        <SearchBar onSearch={handleSearch} />
        <SortMenu onSortChange={handleSortChange} />
      </div>

      {filteredMenu.length === 0 ? (
        <NotFoundProduct />
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMenu.map((product) => (
            <MenuItem product={product} key={product.id} />
          ))}
        </ul>
      )}
    </div>
  );
}

export async function loader() {
  const menu = await getMenu();
  return menu;
}
