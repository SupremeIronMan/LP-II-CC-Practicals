import React, { useContext } from "react";
import Frontend from "../../layout/Frontend";
import { CartContext } from "./CartContext";
import { Link } from "react-router-dom";

function Cart() {
  const { state, dispatch } = useContext(CartContext);

  // Calculate total
  const total = state.cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Frontend>
      <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 py-10 px-4">
        <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-8">
          {/* Heading */}
          <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
            🛒 Your Cart
          </h2>

          {/* Empty Cart */}
          {state.cart.length === 0 ? (
            <p className="text-gray-500 text-center py-16 text-lg">
              Your cart is empty.
            </p>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-5">
                {state.cart.map((a) => (
                  <div
                    key={a.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 border rounded-xl p-4 hover:shadow-md transition"
                  >
                    {/* Product Info */}
                    <div className="flex items-center gap-4">
                      <img
                        src={a.image}
                        alt={a.title}
                        className="w-24 h-24 object-cover rounded-lg border"
                      />
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          {a.title}
                        </h3>
                        <p className="text-gray-500 mt-1">
                          ${a.price}
                        </p>
                      </div>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex items-center gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition"
                          onClick={() =>
                            dispatch({ type: "incQty", payload: a })
                          }
                        >
                          +
                        </button>

                        <span className="font-semibold text-gray-700">
                          {a.quantity}
                        </span>

                        <button
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition"
                          onClick={() =>
                            dispatch({ type: "decQty", payload: a })
                          }
                        >
                          -
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                        onClick={() =>
                          dispatch({ type: "remove", payload: a })
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total & Checkout */}
              <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-6 border-t pt-6">
                <p className="text-2xl font-bold text-gray-800">
                  Total: ${total.toFixed(2)}
                </p>

                <Link
                  to="/checkout"
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold shadow-md"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </Frontend>
  );
}

export default Cart;
