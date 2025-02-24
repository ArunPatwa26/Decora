import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Filter } from "lucide-react";

export default class AllProducts extends Component {
  state = {
    products: [],
    filteredProducts: [],
    categories: [],
    selectedCategory: "",
    priceRange: "",
    showFilter: false,
  };

  componentDidMount() {
    this.fetchProducts();
  }

  fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/products/all");
      const data = await response.json();
      const categories = [...new Set(data.map((product) => product.category))];

      this.setState({ products: data, filteredProducts: data, categories });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  handleFilterChange = (priceRange) => {
    const { products } = this.state;
    let filtered = products;

    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      filtered = products.filter((product) => product.price >= min && product.price <= max);
    }

    this.setState({ filteredProducts: filtered, priceRange, showFilter: false });
  };

  render() {
    const { filteredProducts, showFilter, priceRange } = this.state;
    const priceRanges = ["100-300", "300-500", "500-900"];

    return (
      <div className="max-w-6xl mx-auto p-6">
        {/* Go Back Button */}
        <Link to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition mb-4">
          <ArrowLeft size={24} />
          <span className="text-lg font-semibold">Go Back</span>
        </Link>

        <h2 className="text-3xl font-bold text-center mb-6">All Products 🛒</h2>

        {/* Filter Button */}
        <div className="relative z-50">
          <button
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition z-50"
            onClick={() => this.setState({ showFilter: !showFilter })}
          >
            <Filter size={20} className="mr-2" /> Filter
          </button>

          {/* Dropdown Filter Menu */}
          {showFilter && (
            <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-lg p-4 w-48">
              <h4 className="font-semibold mb-2">Price Range</h4>
              {priceRanges.map((range) => (
                <button
                  key={range}
                  className={`block w-full text-left px-3 py-2 rounded-md hover:bg-gray-200 ${
                    priceRange === range ? "bg-gray-300" : ""
                  }`}
                  onClick={() => this.handleFilterChange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="bg-white shadow-lg rounded-lg p-4 transition-transform transform hover:scale-105">
                <Link to={`/product/${product.id}`} className="block">
                  <img src={product.imageUrl} alt={product.title} className="w-full h-48 object-cover rounded-lg" />
                </Link>
                <div className="text-center mt-4">
                  <h5 className="text-lg font-semibold">{product.title}</h5>
                  <p className="text-green-600 font-bold">${product.price}</p>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-lg font-semibold mt-10 col-span-full">
              <p>No products found! 😔</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
