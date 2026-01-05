
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Plus, Minus, ArrowLeft } from 'lucide-react';
import { API_URL } from '../config';

const NewOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addedItems } = location.state || {};  // Get the selected items from MenuPage
  const [formData, setFormData] = useState({
    tableNumber: '',
    items: addedItems || [],  // Initialize items with selected items
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch available tables
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch(`${API_URL}/api/tables?status=available`);
        if (!response.ok) throw new Error('Failed to fetch tables');
        const data = await response.json();
        setTables(data);
      } catch (err) {
        setError('Could not load tables. Try refreshing.');
        console.error('Fetch tables error:', err);
      }
    };
    fetchTables();
  }, []);

  // Handle form changes (item quantity or special instructions)
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = field === 'quantity' ? parseInt(value) || 1 : value;
    setFormData({ ...formData, items: updatedItems });
  };

  // Submit the order
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate form data
      if (!formData.tableNumber) throw new Error('Please select a table');
      if (formData.items.some(item => !item.name.trim())) throw new Error('All items need a name');

      // POST request to place the order
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableNumber: formData.tableNumber,
          items: formData.items,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Order failed');
      }

      // Redirect to the orders page with success message
      navigate('/orders', { state: { success: 'Order placed successfully!' } });
    } catch (err) {
      setError(err.message);
      console.error('Order submission error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-rose-50">
      <Navbar />
      <div className="container mx-auto p-4 max-w-3xl">
        <button
          onClick={() => navigate('/menu')}
          className="flex items-center gap-2 text-rose-600 mb-4"
        >
          <ArrowLeft size={18} />
          Back to The Menu
        </button>

        <h1 className="text-2xl font-bold mb-6">Create New Order</h1>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {/* Table Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Table *
            </label>
            <select
              value={formData.tableNumber}
              onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">-- Select Table --</option>
              {tables.map((table) => (
                <option key={table._id} value={table.number}>
                  Table {table.number} ({table.seats} seats)
                </option>
              ))}
            </select>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Items *
            </label>

            {formData.items.map((item, index) => (
              <div key={index} className="border-b border-gray-100 pb-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">{item.name}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Special Instructions</label>
                    <input
                      type="text"
                      value={item.notes}
                      onChange={(e) => handleItemChange(index, 'notes', e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="e.g., no onions, extra spicy"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-600 disabled:bg-rose-300"
            >
              {isLoading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewOrder;
