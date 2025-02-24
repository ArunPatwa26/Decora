import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

class Footer extends Component {
  render() {
    return (
      <footer className="bg-gray-100 text-gray-700 py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
            
            {/* Company Info */}
            <div>
              <h2 className="text-xl font-bold text-gray-800">Decora</h2>
              <p className="text-sm mt-2">
                Elevate your space with Decora’s premium home decor collections.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-gray-800">Quick Links</h3>
              <ul className="mt-2 space-y-2">
                <li><Link to="/" className="hover:text-blue-500">Home</Link></li>
                <li><Link to="/about" className="hover:text-blue-500">About Us</Link></li>
                <li><Link to="/products" className="hover:text-blue-500">Products</Link></li>
                <li><Link to="/contact" className="hover:text-blue-500">Contact</Link></li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="font-semibold text-gray-800">Follow Us</h3>
              <div className="flex justify-center md:justify-start space-x-4 mt-2">
                <a href="#" className="text-gray-600 hover:text-blue-500"><FaFacebookF size={20} /></a>
                <a href="#" className="text-gray-600 hover:text-pink-500"><FaInstagram size={20} /></a>
                <a href="#" className="text-gray-600 hover:text-blue-400"><FaTwitter size={20} /></a>
                <a href="#" className="text-gray-600 hover:text-blue-700"><FaLinkedin size={20} /></a>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold text-gray-800">Contact</h3>
              <p className="text-sm mt-2">📍 123 Decor Lane, New York, USA</p>
              <p className="text-sm">📧 support@decora.com</p>
              <p className="text-sm">📞 +1 234 567 890</p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="text-center border-t mt-6 pt-4 text-sm text-gray-600">
            © {new Date().getFullYear()} Decora. All rights reserved.
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
