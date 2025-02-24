import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default class WishlistProducts extends Component {
  state = {
    wishlist: [],
  };

  componentDidMount() {
    this.loadWishlist();
  }

  // Load the wishlist for the logged-in user
  loadWishlist = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const userWishlist = wishlist.find((entry) => entry.userId === user._id);

    // Preserve original order
    this.setState({ wishlist: userWishlist ? userWishlist.products : [] });
  };

  // Remove a product from the wishlist
  removeFromWishlist = (productId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const userWishlistIndex = wishlist.findIndex((entry) => entry.userId === user._id);

    if (userWishlistIndex !== -1) {
      wishlist[userWishlistIndex].products = wishlist[userWishlistIndex].products.filter(
        (product) => product._id !== productId
      );

      if (wishlist[userWishlistIndex].products.length === 0) {
        wishlist.splice(userWishlistIndex, 1);
      }

      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      this.loadWishlist();
      toast.success("Removed from wishlist ✅", { position: "top-center" });
    }
  };

  render() {
    const { wishlist } = this.state;

    return (
      <div className="max-w-6xl mx-auto p-6 max-h-6xl">
        {/* Go Back Button */}
        <Link to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition mb-4">
          <ArrowLeft size={24} />
          <span className="text-lg font-semibold">Go Back</span>
        </Link>

        <h2 className="text-2xl font-bold text-center mb-6">Your Wishlist ❤️</h2>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 m-6">
            {wishlist.map((product, index) => (
              <div
                key={product._id}
                className="bg-white shadow-md rounded-lg p-4 transition-transform transform hover:scale-105 flex flex-col"
                style={{ order: index }} // Maintain order
              >
                <Link to={`/product/${product._id}`} className="block">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </Link>
                <div className="text-center mt-4 flex flex-col flex-grow">
                  <h5 className="text-lg font-semibold">{product.name}</h5>
                  <p className="text-green-600 font-bold">${product.price}</p>
                  <button
                    className="mt-auto px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    onClick={() => this.removeFromWishlist(product._id)}
                  >
                    ❌ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-lg font-semibold m-50">
            <p>No items in your wishlist. 😔</p>
          </div>
        )}
      </div>
    );
  }
}
