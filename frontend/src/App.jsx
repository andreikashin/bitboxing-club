import { useState } from "react";
import DeviceForm from "./components/DeviceForm";

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
    <div className="flex flex-col items-center p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Add a Device to NetBox
      </h1>
      <DeviceForm />
    </div>
  );
}

export default App;
