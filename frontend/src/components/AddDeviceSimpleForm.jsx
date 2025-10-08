import React, { useState, useEffect } from "react";

// This helper function can be inside the component or outside, but here is fine.
async function addDeviceInNetBox(deviceInfo) {
  // Replace with your actual backend URL
  const backendUrl = "http://localhost:8000/add-device/";

  const response = await fetch(backendUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(deviceInfo),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to add device");
  }

  return await response.json();
}

function AddDeviceSimpleForm() {
  const [deviceRoles, setDeviceRoles] = useState([]);
  const [deviceName, setDeviceName] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  // Add state for device types and sites as well
  // const [deviceTypes, setDeviceTypes] = useState([]);
  // const [sites, setSites] = useState([]);

  useEffect(() => {
    async function fetchRoles() {
      try {
        // Replace with your actual backend URL
        const response = await fetch("http://localhost:8000/device-roles/");
        const data = await response.json();
        setDeviceRoles(data);
        if (data.length > 0) {
          setSelectedRole(data[0].slug);
        }
      } catch (error) {
        console.error("Failed to fetch device roles:", error);
      }
    }
    fetchRoles();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const deviceData = {
      name: deviceName,
      device_role_slug: selectedRole,
      // You'll need to get these values from other form inputs
      device_type_slug: "your-device-type-slug",
      site_slug: "your-site-slug",
    };

    try {
      const result = await addDeviceInNetBox(deviceData);
      alert(`Success: ${result.message}`);
      setDeviceName(""); // Clear form on success
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Device</h2>
      <div>
        <label htmlFor="device-name">Device Name:</label>
        <input
          id="device-name"
          type="text"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="device-role">Device Role:</label>
        <select
          id="device-role"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          {deviceRoles.map((role) => (
            <option key={role.slug} value={role.slug}>
              {role.name}
            </option>
          ))}
        </select>
      </div>
      {/* Add similar dropdowns for Device Type and Site */}
      <button type="submit">Add Device</button>
    </form>
  );
}

export default AddDeviceSimpleForm;
