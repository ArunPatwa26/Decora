import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/products/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        setProduct(data);
        setMainImage(data.images ? data.images[0] : "https://via.placeholder.com/300");
        fetchRelatedProducts(data.category, data.id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const fetchRelatedProducts = async (category, currentProductId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/products/category/${category}`);
      if (!response.ok) {
        throw new Error("Failed to fetch related products");
      }
      const data = await response.json();
      const filteredProducts = data.filter((item) => item._id !== currentProductId);
      setRelatedProducts(filteredProducts);
    } catch (err) {
      console.error("Error fetching related products:", err.message);
    }
  };

  const addToWishlist = (product) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const userWishlistIndex = wishlist.findIndex((entry) => entry.userId === user._id);

    if (userWishlistIndex !== -1) {
      const isProductInWishlist = wishlist[userWishlistIndex].products.some((item) => item.id === product.id);
      if (isProductInWishlist) {
        toast.info(`${product.name} is already in your wishlist!`);
        return;
      }
      wishlist[userWishlistIndex].products.push(product);
    } else {
      wishlist.push({ userId: user._id, products: [product] });
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    toast.success(`${product.name} added to wishlist!`);
  };

  const addToCart = async (cartItem) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user._id) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          cartItem,
          quantity,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`${cartItem.name} added to cart successfully!`);
        setTimeout(() => {
          navigate("/cart");
        }, 1500);
      } else {
        toast.error("Failed to add item to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Something went wrong!");
    }
  };

  if (loading) return <div className="text-center mt-10 text-xl font-semibold">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-xl text-red-600">{error}</div>;
  if (!product) return <div className="text-center mt-10 text-xl font-semibold">Product not found</div>;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="max-w-6xl w-full bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Product Details</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-all"
          >
            Go Back
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-row gap-4 items-start w-1/2">
            <div className="flex flex-col gap-2 overflow-auto scrollbar-none">
              {product.images?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg cursor-pointer border hover:border-blue-500"
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
            <img src={mainImage} alt={product.name} className="w-90 h-105 object-cover rounded-lg border" />
          </div>

          <div className="w-1/2 p-4 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-800">{product.name}</h2>
            <p className="text-lg font-bold text-blue-600 mt-2">${product.price}</p>
            <p className="text-gray-700 mt-2"><strong>Category:</strong> {product.category || "N/A"}</p>

            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-all"
              >
                -
              </button>
              <span className="text-xl font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-all"
              >
                +
              </button>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => addToCart(product)}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
              >
                Add to Cart 🛒
              </button>
              <button
                onClick={() => addToWishlist(product)}
                className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-700 transition-all"
              >
                Add to Wishlist ❤️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
