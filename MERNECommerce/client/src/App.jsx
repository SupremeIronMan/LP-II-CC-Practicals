import { useEffect, useState } from "react";
import axios from "axios";

const apiOrigin = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const PRODUCTS_URL = `${apiOrigin}/api/products`;
const ORDERS_URL = `${apiOrigin}/api/orders`;

function money(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return "—";
  return `$${x.toFixed(2)}`;
}

function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  const fetchProducts = async () => {
    const { data } = await axios.get(PRODUCTS_URL);
    setProducts(data);
  };

  const fetchOrders = async () => {
    const { data } = await axios.get(ORDERS_URL);
    setOrders(data);
  };

  const refresh = async () => {
    try {
      setLoading(true);
      setError("");
      await Promise.all([fetchProducts(), fetchOrders()]);
    } catch (e) {
      setError("Could not load shop data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const cartLines = Object.entries(cart)
    .map(([id, qty]) => {
      const p = products.find((x) => x._id === id);
      return p ? { product: p, quantity: qty } : null;
    })
    .filter(Boolean);

  const cartTotal = cartLines.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0
  );

  const addToCart = (product) => {
    setError("");
    setCart((prev) => {
      const q = prev[product._id] || 0;
      const next = q + 1;
      if (next > product.stock) {
        setError("Not enough stock for that quantity.");
        return prev;
      }
      return { ...prev, [product._id]: next };
    });
  };

  const decLine = (productId) => {
    setCart((prev) => {
      const q = prev[productId] || 0;
      if (q <= 1) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: q - 1 };
    });
  };

  const incLine = (product) => {
    setCart((prev) => {
      const q = prev[product._id] || 0;
      if (q >= product.stock) {
        setError("Cannot add more than available stock.");
        return prev;
      }
      return { ...prev, [product._id]: q + 1 };
    });
  };

  const removeLine = (productId) => {
    setCart((prev) => {
      const { [productId]: _, ...rest } = prev;
      return rest;
    });
  };

  const checkout = async (e) => {
    e.preventDefault();
    const items = Object.entries(cart).map(([productId, quantity]) => ({
      productId,
      quantity,
    }));
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    try {
      setError("");
      await axios.post(ORDERS_URL, {
        customerName: customerName.trim() || undefined,
        items,
      });
      setCart({});
      setCustomerName("");
      await refresh();
    } catch (err) {
      const msg =
        err.response?.data?.message || "Checkout failed. Check stock and try again.";
      setError(msg);
      await fetchProducts();
    }
  };

  const handleNewProduct = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await axios.post(PRODUCTS_URL, {
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
      });
      setNewProduct({ name: "", description: "", price: "", stock: "" });
      fetchProducts();
    } catch (err) {
      setError("Could not add product.");
    }
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setEditForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      stock: String(p.stock),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id) => {
    try {
      setError("");
      const { data } = await axios.put(`${PRODUCTS_URL}/${id}`, {
        name: editForm.name,
        description: editForm.description,
        price: Number(editForm.price),
        stock: Number(editForm.stock),
      });
      setProducts((prev) => prev.map((p) => (p._id === id ? data : p)));
      cancelEdit();
    } catch (err) {
      setError("Could not update product.");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Remove this product from the catalog?")) return;
    try {
      setError("");
      await axios.delete(`${PRODUCTS_URL}/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      removeLine(id);
    } catch (err) {
      setError("Could not delete product.");
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return "";
    }
  };

  return (
    <div className="container">
      <h1>Mini shop</h1>
      <p className="subtitle">
        Browse products, fill a cart, and simulate checkout. Inventory updates on
        each order; no payment gateway.
      </p>

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <section>
            <h2>Catalog</h2>
            <div className="grid products-grid">
              {products.map((p) => (
                <div key={p._id} className="card">
                  {editingId === p._id ? (
                    <div className="edit-panel">
                      <input
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm((s) => ({ ...s, name: e.target.value }))
                        }
                      />
                      <textarea
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm((s) => ({ ...s, description: e.target.value }))
                        }
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editForm.price}
                        onChange={(e) =>
                          setEditForm((s) => ({ ...s, price: e.target.value }))
                        }
                      />
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={editForm.stock}
                        onChange={(e) =>
                          setEditForm((s) => ({ ...s, stock: e.target.value }))
                        }
                      />
                      <div className="row">
                        <button type="button" onClick={() => saveEdit(p._id)}>
                          Save
                        </button>
                        <button
                          type="button"
                          className="secondary small"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <strong>{p.name}</strong>
                      <div className="desc">{p.description}</div>
                      <div className="row">
                        <span className="price">{money(p.price)}</span>
                        <span className="stock">{p.stock} in stock</span>
                      </div>
                      <div className="row">
                        <button
                          type="button"
                          className="small"
                          onClick={() => addToCart(p)}
                          disabled={p.stock < 1}
                        >
                          Add to cart
                        </button>
                        <div className="list-tools">
                          <button
                            type="button"
                            className="secondary small"
                            onClick={() => startEdit(p)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="danger small"
                            onClick={() => deleteProduct(p._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2>Cart</h2>
            {cartLines.length === 0 ? (
              <p>Nothing in the cart yet.</p>
            ) : (
              <>
                {cartLines.map(({ product: p, quantity }) => (
                  <div key={p._id} className="cart-line">
                    <span>
                      {p.name} × {quantity}
                    </span>
                    <span>{money(p.price * quantity)}</span>
                    <div className="qty-btns">
                      <button
                        type="button"
                        className="small secondary"
                        onClick={() => decLine(p._id)}
                      >
                        −
                      </button>
                      <span>{quantity}</span>
                      <button
                        type="button"
                        className="small secondary"
                        onClick={() => incLine(p)}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="small danger"
                        onClick={() => removeLine(p._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <p>
                  <strong>Subtotal:</strong> {money(cartTotal)}
                </p>
                <form onSubmit={checkout} className="form">
                  <label htmlFor="customerName">Name for order (optional)</label>
                  <input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Guest"
                  />
                  <button type="submit">Simulate checkout</button>
                </form>
              </>
            )}
          </section>

          <section>
            <h2>Recent orders</h2>
            {orders.length === 0 ? (
              <p>No orders yet.</p>
            ) : (
              orders.map((o) => (
                <div key={o._id} className="order">
                  <div className="order-meta">
                    {formatDate(o.createdAt)} · {o.customerName} ·{" "}
                    <strong>{money(o.total)}</strong> · {o.status}
                  </div>
                  <ul>
                    {o.items.map((line, i) => (
                      <li key={i}>
                        {line.name} × {line.quantity} @ {money(line.unitPrice)} ={" "}
                        {money(line.quantity * line.unitPrice)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </section>

          <section>
            <h2>Add product (admin-style)</h2>
            <form onSubmit={handleNewProduct} className="form">
              <input
                required
                placeholder="Name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct((s) => ({ ...s, name: e.target.value }))
                }
              />
              <textarea
                required
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct((s) => ({ ...s, description: e.target.value }))
                }
              />
              <input
                required
                type="number"
                min="0"
                step="0.01"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct((s) => ({ ...s, price: e.target.value }))
                }
              />
              <input
                required
                type="number"
                min="0"
                step="1"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct((s) => ({ ...s, stock: e.target.value }))
                }
              />
              <button type="submit">Create product</button>
            </form>
          </section>
        </>
      )}
    </div>
  );
}

export default App;
