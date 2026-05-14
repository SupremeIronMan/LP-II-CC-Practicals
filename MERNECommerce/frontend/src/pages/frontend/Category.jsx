import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Frontend from "../../layout/Frontend";

function Category() {
  const { cid } = useParams();
  const [product, setProduct] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/products/category/${cid}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.log(err));
  }, [cid]);

  return (
    <Frontend>
      <section className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-10">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
            Latest Products
          </h2>

          {product.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {product.map((a) => (
                <div
                  key={a._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 group"
                >
                  {/* Image */}
                  <div className="overflow-hidden rounded-t-2xl">
                    <img
                      src={a.image}
                      alt={a.title}
                      className="h-56 w-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                      {a.title}
                    </h3>

                    <p className="text-xl font-bold text-amber-600">
                      NRs {a.price}
                    </p>

                    <button className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-xl font-medium transition duration-300">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center text-lg py-24">
              No products available right now.
            </p>
          )}
        </div>
      </section>
    </Frontend>
  );
}

export default Category;
