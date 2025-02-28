import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Loginregister() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const endpoint = isLogin
      ? "https://dashboard-backend-q56i.onrender.com/login"
      : "https://dashboard-backend-q56i.onrender.com/register";

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: isAdmin ? "admin" : "user",
        };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error: Please check your input fields!");
        setLoading(false);
        return;
      }

      console.log("✅ Success:", data);

      if (isLogin) {
        // Store the token in localStorage
        if (data.token) {
          localStorage.setItem("token", data.token);
          console.log("Token stored:", data.token);
        } else {
          console.error("No token received");
          setError("Authentication error: No token received");
          setLoading(false);
          return;
        }
        
        // Navigate based on user role
        if (data.user?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      } else {
        alert("Registration successful! Please log in.");
        setIsLogin(true);
        setFormData({
          username: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setError("Server Error! Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 transition-all">
        <h2 className="text-2xl font-bold text-center mb-4">
          {isAdmin
            ? isLogin
              ? "Admin Login"
              : "Admin Register"
            : isLogin
            ? "User Login"
            : "User Register"}
        </h2>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm font-medium">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white p-2 rounded-lg`}
            disabled={loading}
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Register"}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="text-blue-500 hover:underline ml-1"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
        <p className="text-center mt-4 text-sm">
          {isAdmin ? "Switch to User" : "Switch to Admin"}{" "}
          <button
            className="text-red-500 hover:underline ml-1"
            onClick={() => setIsAdmin(!isAdmin)}
          >
            {isAdmin ? "User" : "Admin"}
          </button>
        </p>
      </div>
    </div>
  );
}