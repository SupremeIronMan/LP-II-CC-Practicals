import React, { useContext, useEffect, useState } from "react";
import Frontend from "../../layout/Frontend";
import axios from "axios";
import { CartContext } from "./CartContext";

function Home() {
  const { state, dispatch } = useContext(CartContext);
  const [product, setProduct] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => setProduct(res.data));
  }, []);

  return (
    <Frontend>
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6 text-gray-800">Latest Products</h2>

          {product.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {product.map((a) => (
                <div
                  key={a._id}
                  className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                >
                  <div className="relative w-full h-56 overflow-hidden">
                    <img
                      src={a.image || "https://via.placeholder.com/300"}
                      alt={a.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {a.title}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1 truncate">
                        {a.description || "No description available"}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-amber-500 font-bold">Nrs {a.price}</span>
                      <button
                        onClick={() =>
                          dispatch({ type: "addtocart", payload: a })
                        }
                        className="bg-amber-500 text-white text-xs px-3 py-1 rounded-md hover:bg-amber-600 transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-20">
              No products available right now.
            </p>
          )}
        </div>
      </section>
    </Frontend>
  );
}

export default Home;
