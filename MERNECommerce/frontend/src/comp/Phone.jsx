import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FaCartArrowDown } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { CartContext } from "../pages/frontend/CartContext";

function Phone() {
  const { state } = useContext(CartContext);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categories")
      .then(res => setCategory(res.data))
      .catch(err => console.log(err));
  }, []); // ✅ IMPORTANT

  return (
    <>
      <header className="py-3 bg-green-500">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-white">
          <h2 className="text-4xl font-bold">Online Shopping</h2>

          <Link to="/cart" className="flex gap-2 items-center">
            <FaCartArrowDown className="text-2xl" />
            <p>{state.cart.length}</p>
          </Link>
        </div>
      </header>

      <nav className="bg-green-800 text-white p-3 text-center space-x-4">
        <Link to="/">Home</Link>

        {category.map(c => (
          <Link
            key={c._id}
            to={`/products/category/${c._id}`}
            className="hover:underline"
          >
            {c.name}
          </Link>
        ))}

        <Link to="/contact">Contact</Link>
      </nav>
    </>
  );
}

export default Phone;
