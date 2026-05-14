import { Link, useNavigate } from "react-router-dom";

function Backend({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");

    navigate("/admin");
  };
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col h-screen">
        {/* Sidebar Header */}
        <div className="p-6 text-2xl font-bold text-gray-800 border-b border-gray-200">
          Dashboard
        </div>
        <nav className="flex-1 overflow-y-auto mt-4">
          <ul className="space-y-2 px-2">
            <li>
              <Link
                to="/admincategory"
                className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-colors"
              >
                Category
              </Link>
            </li>
            <li>
              <Link
                to="/adminproduct"
                className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-colors"
              >
                Product
              </Link>
            </li>
            <li>
              <Link
                to="/adminorder"
                className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-colors"
              >
                Order
              </Link>
            </li>
            <li >
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-3 text-pink-500 font-bold rounded-lg hover:bg-gray-100 hover:text-red-600 transition-colors"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center border-b border-gray-200">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <div className="text-gray-600 font-medium">User</div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Backend;
