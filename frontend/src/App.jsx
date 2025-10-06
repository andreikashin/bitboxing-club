import { useState } from "react";

function App() {
  const [form, setForm] = useState({ name: "", role: "", type: "", site: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("Adding device...");
    try {
      const res = await fetch("http://localhost:8000/devices/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) setMsg(`✅ Device ${data.device} ha been added!`);
      else setMsg(`❌ Error: ${data.detail}`);
    } catch (err) {
      setMsg(`Connection error: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center p-10">
      <h1 className="text-2xl font-bold mb-4">Add device to NetBox</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
        {["name", "role", "type", "site"].map((f) => (
          <input
            key={f}
            name={f}
            placeholder={f}
            value={form[f]}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        ))}
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Add
        </button>
      </form>
      <p className="mt-4">{msg}</p>
    </div>
  );
}

export default App;
