import React, { Component } from "react";
import { Link } from "react-router-dom";
import Slidder from "../Navbar/Slidder";
import Footer from "../Navbar/Footer";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      categories: [],
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    fetch("http://localhost:3000/api/products/all")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })
      .then((data) => {
        const categoryMap = {};
        data.forEach((product) => {
          if (!categoryMap[product.category]) {
            categoryMap[product.category] = product.imageUrl;
          }
        });

        const categories = Object.entries(categoryMap).map(([category, imageUrl]) => ({
          category,
          imageUrl,
        }));

        this.setState({ products: data.slice(0, 8), categories, loading: false });
      })
      .catch((error) =>
        this.setState({ error: error.message, loading: false })
      );
  }

  addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  render() {
    const { products, categories, loading, error } = this.state;

    return (
      <div>
        <Slidder />

        <h2 className="text-center text-2xl font-bold my-4">Categories</h2>
        <div className="flex justify-center gap-4 flex-wrap p-4">
          {loading && <p className="text-center text-lg font-semibold">Loading...</p>}
          {error && <p className="text-center text-red-500 font-semibold">Error: {error}</p>}
          {categories.map((categoryItem) => (
            <Link
              key={categoryItem.category}
              to={`/products/${categoryItem.category}`}
              className="flex flex-col items-center bg-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
            >
              <img
                src={categoryItem.imageUrl}
                alt={categoryItem.category}
                className="w-18 h-18 rounded-full object-cover"
              />
              <p className="text-sm font-semibold text-center mt-1">{categoryItem.category}</p>
            </Link>
          ))}
        </div>

        <h2 className="text-center text-2xl font-bold my-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-lg rounded-lg p-4 transition-transform hover:scale-105"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg mb-2"
              />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600">Price: ${product.price}</p>
              <p className="text-sm text-gray-500">Category: {product.category}</p>
              <div className="flex justify-between mt-3">
                <button
                  onClick={() => this.addToCart(product)}
                  className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add to Cart 🛒
                </button>
              </div>
              <Link
                to={`/product/${product._id}`}
                className="block mt-2 text-center text-blue-500 font-semibold"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center my-6">
          <Link
            to="/all-products"
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-700 text-lg font-semibold"
          >
            View All Products
          </Link>
        </div>
      </div>
    );
  }
}
