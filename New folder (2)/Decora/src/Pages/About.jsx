import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <motion.div
      className="min-h-screen bg-gray-100 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl w-full text-center">
        <motion.h2
          className="text-3xl font-bold text-gray-800 mb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          About Us
        </motion.h2>
        <motion.p
          className="text-gray-600 leading-relaxed"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Welcome to our platform! We strive to provide the best experience for
          book lovers. Our mission is to make reading more accessible and
          enjoyable for everyone. Join us on this journey to explore a world of
          books and knowledge.
        </motion.p>
        <motion.div
          className="mt-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">
            Learn More
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default About;
