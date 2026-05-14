import React, { useEffect, useState } from "react";
import Backend from "../../layout/Backend";
import { useForm } from "react-hook-form";
import axios from "axios";

function AdminCategory() {
  const { register, handleSubmit, reset } = useForm();
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);

  /* ================= GET ALL CATEGORIES ================= */
  const getAllCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= ADD / UPDATE CATEGORY ================= */
  const onSubmit = async (formData) => {
    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/categories/${editId}`,
          formData
        );
        setEditId(null);
      } else {
        await axios.post("http://localhost:5000/api/categories", formData);
      }
      reset();
      getAllCategories();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const deleteId = async (id) => {
    await axios.delete(`http://localhost:5000/api/categories/${id}`);
    getAllCategories();
  };

  const editIdCategory = (a) => {
    setEditId(a._id);
    reset({ name: a.name });
  };

  return (
    <Backend>
      <div className="p-4 md:p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Category Management
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ================= FORM ================= */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-6 space-y-5"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {editId ? "Update Category" : "Add New Category"}
              </h2>
              <p className="text-sm text-gray-500">
                Manage blog or post categories
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Category Name
              </label>
              <input
                {...register("name", { required: true })}
                placeholder="e.g. Technology"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5
                  focus:outline-none focus:ring-2 focus:ring-amber-500
                  focus:border-amber-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-linear-to-r from-amber-500 to-orange-500
                py-2.5 text-white font-semibold tracking-wide
                hover:from-amber-600 hover:to-orange-600
                active:scale-[0.98] transition-all"
            >
              {editId ? "Update Category" : "Add Category"}
            </button>
          </form>

          {/* ================= TABLE ================= */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                Category List
              </h2>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">#</th>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {data.length > 0 ? (
                  data.map((a, index) => (
                    <tr
                      key={a._id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-gray-700">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {a.name}
                      </td>
                      <td className="px-6 py-4 text-center space-x-2">
                        <button
                          onClick={() => editIdCategory(a)}
                          className="inline-flex items-center gap-1
                            rounded-lg bg-blue-100 px-3 py-1.5
                            text-xs font-semibold text-blue-600
                            hover:bg-blue-200 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteId(a._id)}
                          className="inline-flex items-center gap-1
                            rounded-lg bg-red-100 px-3 py-1.5
                            text-xs font-semibold text-red-600
                            hover:bg-red-200 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No categories found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Backend>
  );
}

export default AdminCategory;
