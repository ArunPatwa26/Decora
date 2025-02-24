import React, { Component } from "react";
import { Link, useParams } from "react-router-dom";

class GetProductsByID extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    const { category } = this.props.params; // Extract category from URL
    fetch(`http://localhost:3000/api/products/category/${category}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })
      .then((data) => this.setState({ products: data, loading: false }))
      .catch((error) => this.setState({ error: error.message, loading: false }));
  }

  render() {
    const { products, loading, error } = this.state;

    if (loading) {
      return <div className="text-center text-lg font-semibold">Loading...</div>;
    }

    if (error) {
      return <div className="text-center text-red-500 font-semibold">Error: {error}</div>;
    }

    return (
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Products in {this.props.params.category}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
           <Link key={product._id}
           to={`/product/${product._id}`}>
            <div key={product.id} className="bg-white shadow-lg rounded-lg p-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg mb-2"
                />
              <p className="text-lg font-semibold">{product.name}</p>
              <p className="text-gray-600">Price: ${product.price}</p>
              <p className="text-gray-600">Category: {product.category}</p>
            </div>
                </Link>
          ))}
        </div>
      </div>
    );
  }
}

// Wrap with useParams hook to get category from URL
export default function (props) {
  const params = useParams();
  return <GetProductsByID {...props} params={params} />;
}
