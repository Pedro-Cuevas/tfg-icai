import axios from "axios";

const BASE_URL = "http://localhost:8000";
axios.defaults.baseURL = BASE_URL;

// Utility function to set up authenticated requests
const authHeader = () => {
  const token = localStorage.getItem("access_token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const login = async (credentials) => {
  try {
    const response = await axios.post("/auth/token/", credentials, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Login failed");
  }
};

const register = async (userData) => {
  try {
    const response = await axios.post("/auth/users/", userData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Registration failed");
  }
};

const fetchHashes = async () => {
  try {
    const response = await axios.get("/api/v1/hashes/", {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const refreshToken = async () => {
  try {
    const response = await axios.post("/auth/token/refresh/", {
      refresh: localStorage.getItem("refresh_token"),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Refreshing token failed");
  }
};

const deleteHash = async (id) => {
  try {
    const response = await axios.delete(`/api/v1/hashes/${id}/`, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Deleting hash failed");
  }
};

const editHash = async (id, hashValue, description) => {
  try {
    const body = {
      hash_value: hashValue,
      description: description,
    };
    const response = await axios.put(`/api/v1/hashes/${id}/`, body, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Editing hash failed");
  }
};

const saveHash = async (hashValue, description) => {
  try {
    const body = {
      hash_value: hashValue,
      description: description,
    };
    const response = await axios.post("/api/v1/hashes/", body, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Saving hash failed");
  }
};

const editPassword = async (currentPassword, newPassword) => {
  try {
    const body = {
      new_password: newPassword,
      current_password: currentPassword,
    };
    const response = await axios.post("/auth/users/set_password/", body, {
      headers: authHeader(),
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const deleteAccount = async (password) => {
  try {
    const headers = authHeader(); // Ensure this function is correctly returning your JWT token
    headers["Content-Type"] = "application/json"; // Good practice, though not strictly necessary

    const response = await axios.delete("/auth/users/me/", {
      headers: headers,
      data: { current_password: password },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export {
  login,
  register,
  fetchHashes,
  refreshToken,
  deleteHash,
  editHash,
  saveHash,
  editPassword,
  deleteAccount,
};
