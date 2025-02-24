import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import GetProductsByID from "./Components/GetProductsByID";
import Home from "./Pages/Home";
import Login from "./Components/Login"
import Profile from "./Components/Profile";
import Footer from "./Navbar/Footer";
import ProductDetails from "./Components/ProductDeatils";
import Search from "./Pages/Search";
import WishlistProducts from "./Pages/WishlistProducts";
import AllProducts from "./Pages/AllProducts";
import SignUp from "./Components/SignUp";
import About from "./Pages/About";
import Contact from "./Pages/Contact"
import EditProfile from "./Components/EditProfile";
import Cart from "./Pages/Cart";
import Order from "./Pages/Order";
import Orders from "./Pages/Orders";


function App() {
  return (
    <div className="mx-10">
      <Navbar />
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/products/:category" element={<GetProductsByID />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/search" element={<Search />} />
        <Route path="/wishlist" element={<WishlistProducts />} />
        <Route path="/all-products" element={<AllProducts />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<Order />} />
        <Route path="/orders" element={<Orders />} />
    </Routes>
    <Footer />
    </div>
  );
}

export default App;
