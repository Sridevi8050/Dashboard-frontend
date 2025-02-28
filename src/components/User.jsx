import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function User() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  
  useEffect(() => {
    setLoading(true);
    setError("");
    
    fetch("https://dashboard-backend-q56i.onrender.com/user/view")
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError(err.message || "Error fetching data");
        setLoading(false);
      });
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-center text-blue-600">User Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-lg p-5">
        <h3 className="text-xl font-semibold mb-3">Available Items</h3>
        {loading ? (
          <p className="text-center py-4">Loading data...</p>
        ) : data.length === 0 ? (
          <p className="text-center py-4">No items available yet.</p>
        ) : (
          <ul className="space-y-4">
            {data.map((item) => (
              <li key={item.id} className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-gray-600">{item.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}