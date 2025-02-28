
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

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "https://dashboard-backend-q56i.onrender.com/login" : "https://dashboard-backend-q56i.onrender.com/register";

    // Payload structure
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: isAdmin ? "admin" : "user", // Add role during registration
        };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Error: Please check your input fields!");
        return;
      }

      console.log("✅ Success:", data);

      if (isLogin) {
        // Login: Check role from backend
        if (data.user?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      } else {
        // Register: Show success message but don't navigate
        alert("Registration successful! Please log in.");
        setIsLogin(true); // Switch to login mode after registration
      }
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Server Error!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 transition-all">
        <h2 className="text-2xl font-bold text-center mb-4">
          {isAdmin ? (isLogin ? "Admin Login" : "Admin Register") : (isLogin ? "User Login" : "User Register")}
        </h2>
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
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"} 
          <button className="text-blue-500 hover:underline ml-1" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
        <p className="text-center mt-4 text-sm">
          {isAdmin ? "Switch to User" : "Switch to Admin"} 
          <button className="text-red-500 hover:underline ml-1" onClick={() => setIsAdmin(!isAdmin)}>
            {isAdmin ? "User" : "Admin"}
          </button>
        </p>
      </div>
    </div>
  );
}
