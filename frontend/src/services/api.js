// src/services/api.js
const API_BASE_URL = "http://backend:8000";

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = { "Content-Type": "application/json", ...options.headers };
  const config = { ...options, headers };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "An error occurred");
    }
    return data;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}

export const api = {
  getDeviceRoles: () => request("/device-roles/"),
  getDeviceTypes: () => request("/device-types/"), // TODO
  getSites: () => request("/sites/"),             // TODO
  addDevice: (deviceData) => request("/devices/", {
    method: "POST",
    body: JSON.stringify(deviceData),
  }),
};