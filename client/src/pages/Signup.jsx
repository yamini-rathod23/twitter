import { useState } from 'react';
import { signup } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input name="name" value={formData.name} onChange={handleChange} type="text" placeholder="Username"  className="w-full px-4 py-2 mb-4 border border-gray-300 rounded" />
          <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Email"  className="w-full px-4 py-2 mb-4 border border-gray-300 rounded" />
          <input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Password"  className="w-full px-4 py-2 mb-4 border border-gray-300 rounded" />
          <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-4">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
