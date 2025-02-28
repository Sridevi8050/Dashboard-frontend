import { useState, useEffect } from "react";

export default function Admin() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Function to fetch data from backend
  const fetchData = async () => {
    const res = await fetch("https://dashboard-backend-q56i.onrender.com/admin/data");
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to create data
  const createData = async () => {
    await fetch("https://dashboard-backend-q56i.onrender.com/admin/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    setTitle("");
    setDescription("");
    fetchData(); // Refresh data after creation
  };

  // Function to update data
  const updateData = async (id) => {
    const updatedTitle = prompt("Enter new title:");
    const updatedDescription = prompt("Enter new description:");

    if (!updatedTitle || !updatedDescription) return;

    await fetch(`https://dashboard-backend-q56i.onrender.com/admin/data/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: updatedTitle, description: updatedDescription }),
    });

    fetchData(); // Refresh data after update
  };

  // Function to delete data
  const deleteData = async (id) => {
    await fetch(`https://dashboard-backend-q56i.onrender.com/admin/data/${id}`, {
      method: "DELETE",
    });

    fetchData(); // Refresh data after delete
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-5 text-blue-600">Admin CRUD</h2>
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
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          onClick={createData}
        >
          Create
        </button>
      </div>

      <ul className="space-y-4">
        {data.map((item) => (
          <li
            key={item.id}
            className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm flex justify-between items-center"
          >
            <span>{item.title} - {item.description}</span>
            <div className="space-x-2">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
                onClick={() => updateData(item.id)}
              >
                Update
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                onClick={() => deleteData(item.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
