import { useState } from 'react';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Login({ setCurrentUser }) {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
      const res = await login(formData);
     
      const { token, user } = res.data;//


     
      localStorage.setItem("user", JSON.stringify(res.data.user)); // 👈 Save user too
       setCurrentUser(user);             // ✅ save user globally
      navigate('/home'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Email" className="input" />
          <input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Password" className="input" />
          <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-4">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
