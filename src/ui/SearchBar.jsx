import React, { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // Arama terimini üst bileşene ilet
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search..."
        className="input p-2 border border-gray-200 rounded-lg "
      />
    </div>
  );
}
