import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { Plus, Split, RefreshCcw } from "lucide-react";
import ProtectedRoute from "../components/ProtectedRoute"; // ADD IMPORT
import { API_URL } from '../config';

const MergeSplitTables = () => {
  const [tables, setTables] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Create axios instance with auth header
  const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });

  const fetchTables = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tables");
      setTables(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch tables");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const toggleTable = (tableId) => {
    if (selectedTables.includes(tableId)) {
      setSelectedTables(selectedTables.filter((id) => id !== tableId));
    } else {
      setSelectedTables([...selectedTables, tableId]);
    }
  };

  const handleMerge = async () => {
    if (selectedTables.length < 2) {
      toast.error("Select at least 2 tables to merge.");
      return;
    }
    try {
      const mainTableNumber = tables.find(t => t._id === selectedTables[0])?.number;
      const tablesToMerge = selectedTables.slice(1).map(id => tables.find(t => t._id === id)?.number);

      await api.post("/tables/merge", {
        mainTableNumber,
        tablesToMerge,
      });

      toast.success("Tables merged successfully");
      setSelectedTables([]);
      fetchTables();
    } catch (err) {
      console.error(err);
      toast.error("Failed to merge tables");
    }
  };

  const handleSplit = async () => {
    if (selectedTables.length !== 1) {
      toast.error("Select exactly one merged table to split.");
      return;
    }

    const selectedTable = tables.find((t) => t._id === selectedTables[0]);

    if (!selectedTable || selectedTable.status !== "merged") {
      toast.error("Selected table is not a merged table.");
      return;
    }

    try {
      await api.post("/tables/split", {
        mainTableNumber: selectedTable.number,
        tablesToSplit: selectedTable.mergedWith?.map(t => tables.find(tab => tab._id === t)?.number) || [],
      });

      toast.success("Table split successfully");
      setSelectedTables([]);
      fetchTables();
    } catch (err) {
      console.error(err);
      toast.error("Failed to split table");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Merge & Split Tables</h1>
          <button
            className="btn btn-outline btn-sm flex items-center"
            onClick={fetchTables}
            disabled={loading}
          >
            <RefreshCcw className="w-4 h-4 mr-2" /> Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading tables...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {tables.map((table) => (
              <div
                key={table._id}
                className={`border p-4 rounded-lg shadow-md cursor-pointer ${
                  selectedTables.includes(table._id)
                    ? "bg-rose-100 border-rose-400"
                    : "bg-white"
                }`}
                onClick={() => toggleTable(table._id)}
              >
                <p className="font-semibold">Table #{table.number}</p>
                <p className="text-sm text-gray-600">
                  Seats: {table.seats} | Status: {table.status}
                </p>
                {table.mergedWith?.length > 0 && (
                  <p className="text-xs text-gray-500">
                    Merged with {table.mergedWith.length} tables
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center gap-4 mt-6">
          <button
            className="btn btn-success flex items-center"
            onClick={handleMerge}
            disabled={loading}
          >
            <Plus className="w-4 h-4 mr-2" /> Merge Tables
          </button>

          <button
            className="btn btn-warning flex items-center"
            onClick={handleSplit}
            disabled={loading}
          >
            <Split className="w-4 h-4 mr-2" /> Split Table
          </button>
        </div>
      </div>
    </div>
  );
};

// WRAP WITH ProtectedRoute
export default function ProtectedMergeSplitTables() {
  return (
    <ProtectedRoute allowedRoles={['staff']}>
      <MergeSplitTables />
    </ProtectedRoute>
  );
}