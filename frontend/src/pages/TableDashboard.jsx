
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProtectedRoute from '../components/ProtectedRoute';

// Fallback icons if Lucide fails (using simple text)
const PlusIcon = () => <span>+</span>;
const PencilIcon = () => <span>✏️</span>;

const TableDashboard = () => {
  const [tables, setTables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchTables = () => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    
    fetch("http://localhost:5002/api/tables", {
      headers: {
        'Authorization': `Bearer ${token}` // Add authorization header
      }
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            navigate('/login'); // Redirect to login
            throw new Error("Unauthorized");
          }
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setTables(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to load tables. Please refresh.");
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchTables();
    const intervalId = setInterval(fetchTables, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <ProtectedRoute allowedRoles={['staff']}>  {/* ADD THIS WRAPPER */}
      <div>
        <Navbar />
        <div className="p-4">
          <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
            <h2 className="text-2xl font-bold">Live Table Status</h2>
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/merge-split-tables")}
                className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md"
              >
                🔀 Merge/Split
              </button>
              <button
                onClick={() => navigate("/tables/new")}
                className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
              >
                <PlusIcon /> Add
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 py-2">
              {error}{" "}
              <button onClick={fetchTables} className="ml-2 text-blue-600 underline">
                Retry
              </button>
            </p>
          )}

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tables.map((table) => (
                <div
                  key={table._id}
                  className={`p-4 rounded-lg shadow-md border-l-4 ${
                    table.status === "available"
                      ? "bg-blue-50 border-blue-400"
                      : table.status === "occupied"
                      ? "bg-pink-50 border-pink-400"
                      : "bg-amber-50 border-amber-400"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">Table {table.number}</h3>
                      <p>Seats: {table.seats}</p>
                      <p>Status: {table.status}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/tables/edit/${table._id}`)}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <PencilIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default TableDashboard;
