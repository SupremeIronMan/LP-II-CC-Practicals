import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import Frontend from "../../layout/Frontend";
import { CartContext } from "./CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const navigate = useNavigate();
  const { state } = useContext(CartContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const total = state.cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const onSubmit = async (data) => {
    const orderData = {
      customer: data,
      items: state.cart,
      totalAmount: total,
    };

    try {
      await axios.post("http://localhost:5000/api/orders", orderData);
      alert("Order placed successfully!");
      navigate("/");
    } catch (error) {
      console.error(error.response?.data || error);
      alert("Order failed!");
    }
  };

  return (
    <Frontend>
      <section className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Checkout Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-8">
              Checkout
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  className={`w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-amber-400 focus:outline-none ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("name", { required: true })}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    Name is required
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className={`w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-amber-400 focus:outline-none ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    Email is required
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  className={`w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-amber-400 focus:outline-none ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("phone", { required: true })}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    Phone is required
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  rows="3"
                  className={`w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-amber-400 focus:outline-none ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("address", { required: true })}
                ></textarea>
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">
                    Address is required
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-semibold tracking-wide transition duration-300 shadow-md"
              >
                Cash on Delivery Order
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-8 h-fit">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 max-h-87.5 overflow-y-auto pr-2">
              {state.cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start border-b pb-3"
                >
                  <div>
                    <p className="font-semibold text-gray-700">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × NRs {item.price}
                    </p>
                  </div>
                  <p className="font-bold text-gray-800">
                    NRs {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t text-xl font-extrabold">
              <span>Total</span>
              <span className="text-amber-600">
                NRs {total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </section>
    </Frontend>
  );
}

export default Checkout;
