// src/components/DeviceForm.jsx
import React, { useState } from "react";
import { useNetboxData } from "../hooks/useNetboxData";
import { api } from "../services/api";

const INITIAL_FORM_STATE = { name: "", role: "", type: "", site: "" };

function DeviceForm() {
  const { data, isLoading, error } = useNetboxData();
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [submission, setSubmission] = useState({ status: "idle", message: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmission({ status: "loading", message: "Adding device..." });
    try {
      const result = await api.addDevice(form);
      setSubmission({
        status: "success",
        message: `✅ Device ${result.device} has been added!`,
      });
      setForm(INITIAL_FORM_STATE); // Reset form on success
    } catch (err) {
      setSubmission({ status: "error", message: `❌ Error: ${err.message}` });
    }
  };

  if (isLoading) return <p>Loading form options...</p>;
  if (error)
    return <p className="text-red-500">Error loading data: {error.message}</p>;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
      <input
        name="name"
        placeholder="Device Name"
        value={form.name}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />

      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      >
        <option value="" disabled>
          Select a Role
        </option>
        {data.roles.map((role) => (
          <option key={role.slug} value={role.slug}>
            {role.name}
          </option>
        ))}
      </select>

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      >
        <option value="" disabled>
          Select a Type
        </option>
        {data.types.map((type) => (
          <option key={type.slug} value={type.slug}>
            {type.model}
          </option>
        ))}
      </select>

      <select
        name="site"
        value={form.site}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      >
        <option value="" disabled>
          Select a Site
        </option>
        {data.sites.map((site) => (
          <option key={site.slug} value={site.slug}>
            {site.name}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white p-2 rounded disabled:bg-gray-400"
        disabled={submission.status === "loading"}
      >
        {submission.status === "loading" ? "Adding..." : "Add Device"}
      </button>

      {submission.message && (
        <p
          className={`mt-4 ${
            submission.status === "error" ? "text-red-500" : "text-green-500"
          }`}
        >
          {submission.message}
        </p>
      )}
    </form>
  );
}

export default DeviceForm;
