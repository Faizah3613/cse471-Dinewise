
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Navbar from '../components/Navbar';
import { Plus, Pencil } from 'lucide-react';
import { API_URL } from '../config';

const OrderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      let endpoint = '/api/orders';
      if (activeTab === 'kitchen') endpoint = '/api/orders/kitchen';
      if (activeTab === 'bar') endpoint = '/api/orders/bar';
      
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,  
        },
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'served': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProtectedRoute allowedRoles={['staff']}>
      <div className="min-h-screen bg-rose-50">
        <Navbar />
        <div className="container mx-auto p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>

          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            {['all', 'kitchen', 'bar'].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 font-medium capitalize ${
                  activeTab === tab 
                    ? 'border-b-2 border-rose-500 text-rose-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-red-800">Connection Error</h3>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
                <button
                  onClick={fetchOrders}
                  className="text-sm font-medium text-red-700 hover:text-red-900"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rose-500" />
            </div>
          ) : (
            /* Order Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.map((order) => (
                <div 
                  key={order._id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-rose-400 hover:shadow-lg transition-shadow"
                >
                  <div className="p-4">
                    {/* Order Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          Table {order.table?.number}
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </h3>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/orders/edit/${order._id}`)}
                        className="text-gray-400 hover:text-rose-500 transition-colors p-1"
                        aria-label="Edit order"
                      >
                        <Pencil size={18} />
                      </button>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2 my-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span>
                            <span className="font-medium">{item.quantity}x</span> {item.name}
                            {item.notes && (
                              <span className="block text-xs text-gray-500 mt-1">Note: {item.notes}</span>
                            )}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            item.category === 'kitchen' 
                              ? 'bg-orange-100 text-orange-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {item.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && orders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No orders found</p>
              <button
                onClick={() => fetchOrders()}
                className="mt-2 text-rose-500 hover:text-rose-700"
              >
                Refresh
              </button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
    );
  };

export default OrderDashboard;