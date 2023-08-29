import React, { useState } from "react";
import { MDBInput, MDBBtn, MDBRow, MDBCol } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { register } from "./apiServices"; // Import the new register function

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    user: "",
    email: "",
    password: "",
    passwordCheck: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.password !== formData.passwordCheck) {
      alert("Passwords do not match!");
      return;
    }
    const serverData = {
      username: formData.user,
      email: formData.email,
      password: formData.password,
      first_name: formData.firstName,
      last_name: formData.lastName,
    };
    try {
      const responseData = await register(serverData);

      alert("Registration successful!");
      console.log("Registration successful!");
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data) {
        alert("Error registering: \n\n" + JSON.stringify(error.response.data));
        console.error("Error registering:", error.response.data);
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
        <MDBRow className="mb-4">
          <MDBCol>
            <MDBInput
              id="form3Example1"
              label="First name"
              name="firstName"
              onChange={handleChange}
              required
            />
          </MDBCol>
          <MDBCol>
            <MDBInput
              id="form3Example2"
              label="Last name"
              name="lastName"
              onChange={handleChange}
              required
            />
          </MDBCol>
        </MDBRow>
        <MDBInput
          className="mb-4"
          id="loginUser"
          label="User"
          name="user"
          onChange={handleChange}
          required
        />
        <MDBInput
          className="mb-4"
          type="email"
          id="form3Example3"
          label="Email address"
          name="email"
          onChange={handleChange}
          required
        />
        <MDBInput
          className="mb-4"
          type="password"
          id="loginPassword"
          label="Password"
          name="password"
          onChange={handleChange}
          required
          pattern="^(?!\d+$).{8,}"
          title="Password must be at least 8 characters and not entirely numeric."
        />
        <MDBInput
          className="mb-4"
          type="password"
          id="loginPasswordCheck"
          label="Repeat the password"
          name="passwordCheck"
          onChange={handleChange}
          required
          pattern="^(?!\d+$).{8,}"
          title="Password must be at least 8 characters and not entirely numeric."
        />
        <MDBBtn type="submit" className="mb-4" block>
          Register
        </MDBBtn>
        <div className="text-center">
          Already a member? <a href="/login">Login</a>
        </div>
      </form>
    </div>
  );
};

export default Register;
