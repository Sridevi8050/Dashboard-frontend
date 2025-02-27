
import { useState, useEffect } from "react";

export default function User() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://dashboard-backend-sepia.vercel.app/user/view")
      .then(res => res.json())
      .then(json => setData(json));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-5 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-5 text-blue-600">User View</h2>
      <ul className="space-y-4">
        {data.map((item) => (
          <li key={item.id} className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
            {item.title} - {item.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

