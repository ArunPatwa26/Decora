import React, { useState } from "react";
import { motion } from "framer-motion";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-100 text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16 px-6 text-center">
        <motion.h1
          className="text-4xl font-bold mb-2"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Contact Us
        </motion.h1>
        <motion.p
          className="text-lg opacity-90"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Have a question? We're here to help!
        </motion.p>
      </section>

      {/* Contact Form */}
      <section className="container mx-auto px-6 py-12">
        <motion.div
          className="bg-white shadow-lg rounded-lg p-8 max-w-lg mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-semibold text-center mb-4">
            Get in Touch
          </h2>
          {submitted ? (
            <p className="text-green-600 text-center">
              ✅ Your message has been sent successfully!
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Send Message
              </button>
            </form>
          )}
        </motion.div>
      </section>

      {/* Contact Info */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">
          {[
            {
              icon: "📍",
              title: "Our Location",
              text: "123 Decor Street, New York, USA",
            },
            {
              icon: "📧",
              title: "Email Us",
              text: "support@decora.com",
            },
            {
              icon: "📞",
              title: "Call Us",
              text: "+1 234 567 890",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="p-6 border border-gray-200 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index }}
            >
              <span className="text-3xl">{item.icon}</span>
              <h3 className="text-xl font-semibold mt-2">{item.title}</h3>
              <p className="text-gray-600 mt-1">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default Contact;
