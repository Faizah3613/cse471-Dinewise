import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer'); // Default role is 'customer'
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Basic validation to check if the passwords match
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    // Send the registration data to the backend
    const response = await fetch('http://localhost:5002/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }), // Include the role in the request
    });

    const data = await response.json();
    if (data.token) {
      // Optionally store the JWT token if you want to auto-login after registration
      localStorage.setItem('token', data.token);

      // Redirect the user to the login page after successful registration
      navigate('/login');
    } else {
      alert('Registration failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-600 to-blue-500">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        {/* Header with "Dinewise" */}
        <h1 className="text-4xl font-bold text-center text-gray-700">Welcome to Dinewise</h1>
        
        {/* Welcome Message */}
        <p className="text-lg text-center text-gray-600 mt-2 mb-6">Your one-stop platform to explore delicious food.</p>

        {/* Registration Form */}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Role selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Select your role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="customer">Customer</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-300"
          >
            Create Account
          </button>
        </form>

        {/* Redirect to login page */}
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-600 font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;





