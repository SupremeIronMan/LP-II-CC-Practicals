import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", data);
      localStorage.setItem("authToken", res.data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* ================= LOGIN CARD ================= */}
      <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Admin Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* ================= EMAIL ================= */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              {...register("email", { required: true })}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transition-shadow shadow-sm"
            />
          </div>

          {/* ================= PASSWORD ================= */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              {...register("password", { required: true })}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transition-shadow shadow-sm"
            />
          </div>

          {/* ================= LOGIN BUTTON ================= */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-linear-to-r from-blue-500 to-indigo-500
              text-white font-semibold text-lg hover:from-blue-600 hover:to-indigo-600
              active:scale-[0.97] transition-all shadow-md"
          >
            Login
          </button>
        </form>

        {/* ================= FORGOT PASSWORD LINK ================= */}
        <div className="text-center mt-4 text-sm text-gray-500">
          <a href="#" className="hover:text-blue-500 transition-colors">
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
