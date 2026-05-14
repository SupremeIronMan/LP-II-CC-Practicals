import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/frontend/Home";
import Dashboard from "./pages/backend/Dashboard";
import AdminCategory from "./pages/backend/AdminCategory";
import AdminProduct from "./pages/backend/AdminProduct";
import Category from "./pages/frontend/Category";
import Login from "./pages/backend/Login";
import Cart from "./pages/frontend/Cart";
import Checkout from "./pages/frontend/Checkout";
import AdminOrder from "./pages/backend/AdminOrder";
import RouteProtection from "./pages/backend/RouteProtection";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/category/:cid" element={<Category />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/adminorder" element={<RouteProtection><AdminOrder /></RouteProtection>} />
          <Route path="/admin" element={<Login />} />
          <Route path="/dashboard" element={<RouteProtection><Dashboard /></RouteProtection>} />
          <Route path="/admincategory" element={<RouteProtection><AdminCategory /></RouteProtection>} />
          <Route path="/adminproduct" element={<RouteProtection><AdminProduct /></RouteProtection>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
