import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionStatus, setActionStatus] = useState({ type: "", message: "" });
  
  const navigate = useNavigate();

  // Helper to get headers with token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      setError("Authentication error. Please login again.");
      navigate("/");
      return null;
    }
    return {
      "Content-Type": "application/json",
      "Authorization": token,
    };
  };

  // Function to fetch data from backend
  const fetchData = async () => {
    setLoading(true);
    setError("");
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await fetch("https://dashboard-backend-q56i.onrender.com/admin/read", {
        headers,
      });
      
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          // Handle authentication errors
          localStorage.removeItem("token");
          navigate("/");
          return;
        }
        
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch data");
      }
      
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Check if we have a token, if not redirect to login
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  // Function to create data
  const createData = async () => {
    if (!title || !description) {
      setError("Title and description are required");
      return;
    }
    
    setLoading(true);
    setError("");
    setActionStatus({ type: "", message: "" });
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await fetch("https://dashboard-backend-q56i.onrender.com/admin/create", {
        method: "POST",
        headers,
        body: JSON.stringify({ title, description }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create item");
      }
      
      const createdItem = await res.json();
      console.log("Created item:", createdItem);
      
      setTitle("");
      setDescription("");
      setActionStatus({ type: "success", message: "Item created successfully!" });
      fetchData(); // Refresh data after creation
    } catch (err) {
      console.error("Create error:", err);
      setError(err.message || "Error creating item");
    } finally {
      setLoading(false);
    }
  };

  // Function to update data
  const updateData = async (id) => {
    const updatedTitle = prompt("Enter new title:");
    if (!updatedTitle) return;
    
    const updatedDescription = prompt("Enter new description:");
    if (!updatedDescription) return;
    
    setLoading(true);
    setError("");
    setActionStatus({ type: "", message: "" });
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await fetch(`https://dashboard-backend-q56i.onrender.com/admin/update/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ title: updatedTitle, description: updatedDescription }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update item");
      }
      
      setActionStatus({ type: "success", message: "Item updated successfully!" });
      fetchData(); // Refresh data after update
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message || "Error updating item");
    } finally {
      setLoading(false);
    }
  };

  // Function to delete data
  const deleteData = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    setLoading(true);
    setError("");
    setActionStatus({ type: "", message: "" });
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      const res = await fetch(`https://dashboard-backend-q56i.onrender.com/admin/delete/${id}`, {
        method: "DELETE",
        headers,
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete item");
      }
      
      setActionStatus({ type: "success", message: "Item deleted successfully!" });
      fetchData(); // Refresh data after delete
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message || "Error deleting item");
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-600">Admin Dashboard</h2>
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
      
      {actionStatus.message && (
        <div className={`mb-4 p-3 ${actionStatus.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-yellow-100 border-yellow-400 text-yellow-700'} border rounded`}>
          {actionStatus.message}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-lg p-5 mb-6">
        <h3 className="text-xl font-semibold mb-3">Create New Item</h3>
        <div className="mb-4">
          <input
            className="border border-gray-300 rounded-lg p-2 w-full mb-2"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="border border-gray-300 rounded-lg p-2 w-full mb-2"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            className={`${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded w-full`}
            onClick={createData}
            disabled={loading}
          >
            {loading ? "Processing..." : "Create"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-5">
        <h3 className="text-xl font-semibold mb-3">Items List</h3>
        {loading && data.length === 0 ? (
          <p className="text-center py-4">Loading data...</p>
        ) : data.length === 0 ? (
          <p className="text-center py-4">No items found. Create your first item!</p>
        ) : (
          <ul className="space-y-4">
            {data.map((item) => (
              <li
                key={item.id}
                className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm flex justify-between items-center"
              >
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                <div className="space-x-2">
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
                    onClick={() => updateData(item.id)}
                    disabled={loading}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                    onClick={() => deleteData(item.id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}