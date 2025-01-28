import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError("Both email and password are required.");
      setLoading(false);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:7000/api/login", formData);
      localStorage.setItem("token", res.data.token);
      setSuccess("Login successful!");
      setTimeout(() => navigate("/todos"), 1500);
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md backdrop-blur-sm bg-opacity-80"> {/* Adjusted opacity */}
        <h2 className="text-center text-4xl font-bold text-indigo-700 mb-6"> {/* Reduced size */}
          Taskify
        </h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center animate-pulse">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4"> {/* Reduced spacing */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out"
            />
          </div>

          <button
            type="submit"
            className={`w-full px-4 py-3 rounded-lg font-medium ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 transition duration-300 ease-in-out"}`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600"> {/* Reduced margin */}
          Don't have an account?{" "}
          <a href="/register" className="text-indigo-500 hover:text-indigo-600 font-semibold transition duration-300 ease-in-out">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;