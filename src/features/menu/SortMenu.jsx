import React from "react";

export default function SortMenu({ onSortChange }) {
  const handleSortChange = (e) => {
    onSortChange(e.target.value);
  };

  return (
    <div className="flex justify-end w-1/2">
      <select
        onChange={handleSortChange}
        className="p-2 border rounded-md text-gray-700"
      >
        <option value="">Sort by</option>
        <option value="asc">Price: Low to High</option>
        <option value="desc">Price: High to Low</option>
        <option value="nameAsc">Name: A-Z</option>
        <option value="nameDesc">Name: Z-A</option>
        <option value="ratingAsc">Rating: Low to High</option>
        <option value="ratingDesc">Rating: High to Low</option>
        <option value="category">Category</option>
        <option value="powerAsc">Power: Low to High</option>
        <option value="powerDesc">Power: High to Low</option>
      </select>
    </div>
  );
}
