import React, { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { getMenu } from "../../services/productService";
import MenuItem from "./MenuItem";
import SortMenu from "./SortMenu";
import SearchBar from "../../ui/common/SearchBar";
import NotFoundProduct from "./NotFoundProduct";
import { FaFilter, FaLightbulb, FaTag } from "react-icons/fa";

export default function Menu() {
  const menu = useLoaderData();
  const [sortedMenu, setSortedMenu] = useState(menu);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMenu, setFilteredMenu] = useState(menu);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique categories from menu
  const categories = ["all", ...new Set(menu.map((item) => item.category))];

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

  // Filter by category and search term
  useEffect(() => {
    let newFilteredMenu = sortedMenu;

    // Apply category filter
    if (selectedCategory !== "all") {
      newFilteredMenu = newFilteredMenu.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Apply search filter
    if (searchTerm) {
      newFilteredMenu = newFilteredMenu.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMenu(newFilteredMenu);
  }, [searchTerm, sortedMenu, selectedCategory]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Elektronik Ürünler
          </h1>
          <p className="text-gray-600 max-w-2xl md:mx-0">
            Ev ve ofis ihtiyaçlarınız için yüksek kaliteli geniş elektronik ürün
            yelpazemizi keşfedin.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <SearchBar onSearch={handleSearch} />
            <div className="flex flex-wrap items-center gap-3">
              <SortMenu onSortChange={handleSortChange} />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-all font-medium"
              >
                <FaFilter className="text-customGreen-500" />
                <span>Filtrele</span>
              </button>
            </div>
          </div>

          {/* Category Filters */}
          {showFilters && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                <FaTag className="text-customGreen-500" />
                Kategoriler
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      selectedCategory === category
                        ? "bg-customGreen-500 text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category === "all" ? "Tüm Ürünler" : category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-700">
            <FaLightbulb className="text-yellow-400" />
            <span>
              <strong>{filteredMenu.length}</strong>{" "}
              {filteredMenu.length === 1 ? "ürün" : "ürün"} bulundu
              {selectedCategory !== "all" &&
                ` ${selectedCategory} kategorisinde`}
            </span>
          </div>
          {selectedCategory !== "all" && (
            <button
              onClick={() => setSelectedCategory("all")}
              className="mt-2 md:mt-0 text-sm text-customGreen-500 hover:text-customGreen-700 hover:underline transition-colors font-medium"
            >
              Filtreyi Temizle
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredMenu.length === 0 ? (
          <NotFoundProduct />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMenu.map((product) => (
              <MenuItem product={product} key={product.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export async function loader() {
  const menu = await getMenu();
  return menu;
}
