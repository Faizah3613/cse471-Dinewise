import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProtectedRoute from '../components/ProtectedRoute';
import { API_URL } from '../config';

const EditTable = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    number: '',
    seats: '',
    status: 'available'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTable = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/tables/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch table');
        }
        const data = await response.json();
        setFormData({
          number: data.number,
          seats: data.seats,
          status: data.status
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTable();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'number' || name === 'seats' ? parseInt(value) || '' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.number || !formData.seats) {
      setError('Table number and seats are required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/tables/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          seats: formData.seats,
          status: formData.status
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update table');
      }

      navigate('/tables'); 
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="p-4 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="p-4 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="p-4 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Table {formData.number}</h2>
        
        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Table Number</label>
            <input
              type="number"
              name="number"
              value={formData.number}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              min="1"
              disabled 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Seats</label>
            <input
              type="number"
              name="seats"
              value={formData.seats}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Update Table
            </button>
            <button
              type="button"
              onClick={() => navigate('/tables')}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function ProtectedEditTable() {
  return (
    <ProtectedRoute allowedRoles={['staff']}>
      <EditTable />
    </ProtectedRoute>
  );
}