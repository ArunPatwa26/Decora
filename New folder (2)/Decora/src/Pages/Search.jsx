import React, { useState } from "react";
import { Link } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/api/products/search/${query}`);
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Search Products</h1>
      <div className="flex w-full max-w-md gap-2">
        <input
          type="text"
          className="border p-2 w-full rounded-lg"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {loading && <p className="mt-4 text-lg font-semibold">Loading...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 w-full max-w-4xl">
        {results.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="block bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <img
              src={product.imageUrl || "https://via.placeholder.com/150"}
              alt={product.name}
              className="w-full h-40 object-cover rounded"
            />
            <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
            <p className="text-blue-600 font-bold">${product.price}</p>
            <p className="text-blue-600 font-bold">${product.category}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Search;
