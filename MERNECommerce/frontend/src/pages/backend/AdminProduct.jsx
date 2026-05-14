import React, { useEffect, useState } from "react";
import Backend from "../../layout/Backend";
import { useForm } from "react-hook-form";
import axios from "axios";

function AdminProduct() {
  const { register, handleSubmit, reset, watch } = useForm();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  /* ================= GET DATA ================= */
  const getCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getCategories();
    getProducts();
  }, []);

  /* ================= ADD/UPDATE PRODUCT ================= */
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("qty", data.qty);
      formData.append("category", data.category);

      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      if (editId) {
        await axios.put(
          `http://localhost:5000/api/products/${editId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        setEditId(null);
      } else {
        await axios.post("http://localhost:5000/api/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      reset();
      setPreviewImage(null);
      getProducts();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= DELETE PRODUCT ================= */
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      getProducts();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= EDIT PRODUCT ================= */
  const editProduct = (product) => {
    setEditId(product._id);
    reset({
      title: product.title,
      description: product.description,
      price: product.price,
      qty: product.qty,
      category: product.category,
      image: product.image,
    });

    setPreviewImage(
      product.image ? `http://localhost:5000/uploads/${product.image}` : null,
    );
  };

  /* ================= IMAGE PREVIEW ================= */
  const watchedImage = watch("image");
  useEffect(() => {
    if (watchedImage && watchedImage.length > 0) {
      const file = watchedImage[0];
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  }, [watchedImage]);

  return (
    <Backend>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ================= PRODUCT FORM ================= */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            {editId ? "Edit Product" : "Add New Product"}
          </h2>

          <div className="space-y-4">
            <input
              {...register("title", { required: true })}
              placeholder="Product Title"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
            />

            <textarea
              {...register("description", { required: true })}
              placeholder="Product Description"
              className="w-full border border-gray-300 rounded-md px-4 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
            />

            <input
              type="number"
              {...register("price", { required: true })}
              placeholder="Price"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
            />

            <input
              type="number"
              {...register("qty", { required: true })}
              placeholder="Quantity"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
            />

            <select
              {...register("category", { required: true })}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              type="file"
              {...register("image")}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
            />

            {/* Show image preview */}
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="w-32 h-32 object-cover rounded mt-2"
              />
            )}

            <button
              type="submit"
              className="w-full bg-amber-500 text-white py-2 rounded-md hover:bg-amber-600 transition font-medium"
            >
              {editId ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>

        {/* ================= PRODUCT TABLE ================= */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm table-auto border-collapse">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-3 py-2 w-10">S.No.</th>
                <th className="px-3 py-2 w-48">Product</th>
                <th className="px-3 py-2 w-48">Image</th>
                <th className="px-3 py-2 w-20">Price</th>
                <th className="px-3 py-2 w-16">Qty</th>
                <th className="px-3 py-2 w-36 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {products.length ? (
                products.map((p, i) => (
                  <tr
                    key={p._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 py-2 text-center">{i + 1}</td>

                    <td className="px-3 py-2">
                      <p className="font-medium text-gray-800 truncate">
                        {p.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate w-48">
                        {p.description}
                      </p>
                    </td>

                    <td className="px-3 py-2">
                      {p.image ? (
                        <img
                          src={`http://localhost:5000/uploads/${p.image}`}
                          alt={p.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">No Image</span>
                      )}
                    </td>

                    <td className="px-3 py-2 text-right">Rs {p.price}</td>
                    <td className="px-3 py-2 text-center">{p.qty}</td>

                    <td className="px-3 py-2 text-center space-x-1">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded-md text-xs hover:bg-blue-600 transition"
                        onClick={() => editProduct(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded-md text-xs hover:bg-red-600 transition"
                        onClick={() => deleteProduct(p._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-400">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Backend>
  );
}

export default AdminProduct;
