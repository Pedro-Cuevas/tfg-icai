import React, { useState } from "react";
import { MDBInput, MDBBtn } from "mdb-react-ui-kit";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import useProtectedRoute from "./useProtectedRoute";
import { login } from "./apiServices"; // Import the new login function

const Login = () => {
  useProtectedRoute();
  const navigate = useNavigate();
  const { setAuthDetails } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const responseData = await login(formData);

      if (responseData && responseData.access && responseData.refresh) {
        setAuthDetails(formData.username, {
          access: responseData.access,
          refresh: responseData.refresh,
        });
        alert("Login successful!");
        console.log("Login successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        alert("Error logging in: \n\n" + JSON.stringify(error.response.data));
        console.error("Error logging in:", error.response.data);
      } else {
        alert("There was an error: \n\n" + error);
        console.error("There was an error:", error);
      }
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center mt-5">
      <form
        onSubmit={handleSubmit}
        className="col-lg-3 col-md-5 col-sm-7 col-8"
      >
        <MDBInput
          className="mb-4"
          id="loginUser"
          label="User"
          name="username"
          required
          onChange={handleChange}
        />
        <MDBInput
          className="mb-4"
          type="password"
          id="loginPassword"
          label="Password"
          name="password"
          onChange={handleChange}
          required
        />

        <MDBBtn type="submit" className="mb-4" block>
          Login
        </MDBBtn>

        <div className="text-center">
          Not a member? <a href="/register">Register</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
