import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import NotLoggedInComponent from "./NotLoggedInComponent";
import { editPassword, refreshToken, deleteAccount } from "./apiServices";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBInput,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";

const Account = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [showModalPassword, setShowModalPassword] = useState(false);
  const [showModalAccount, setShowModalAccount] = useState(false);
  const [formPasswordData, setFormPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    checkNewPassword: "",
  });

  const toggleShowPassword = () => {
    setShowModalPassword(!showModalPassword);
    setFormPasswordData({
      currentPassword: "",
      newPassword: "",
      checkNewPassword: "",
    });
  };
  const toggleShowAccount = () => {
    setShowModalAccount(!showModalAccount);
    setFormPasswordData({
      currentPassword: "",
      newPassword: "",
      checkNewPassword: "",
    });
  };

  const handleFormPasswordChange = (e) => {
    const { name, value } = e.target;
    setFormPasswordData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleChangePassword = async () => {
    if (formPasswordData.newPassword !== formPasswordData.checkNewPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const data = await editPassword(
        formPasswordData.currentPassword,
        formPasswordData.newPassword
      );
      console.log(data);
      alert("Password changed successfully!");
      toggleShowPassword();
    } catch (error) {
      handleErrorPassword(error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const data = await deleteAccount(formPasswordData.currentPassword);
      console.log(data);
      alert("Account deleted successfully!");
      toggleShowAccount();
      logout();
    } catch (error) {
      handleErrorDelete(error);
    }
  };

  //esta logica se deberia hacer en apiServices.js

  const handleErrorPassword = async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const tokenData = await refreshToken();
        localStorage.setItem("access_token", tokenData.access);
        console.log("Token refreshed.");
        const data = await editPassword(
          formPasswordData.currentPassword,
          formPasswordData.newPassword
        );
        console.log(data);
        alert("Password changed successfully!");
        toggleShowPassword();
      } catch (refreshError) {
        const errorMessage = refreshError.response
          ? JSON.stringify(refreshError.response.data)
          : "An error occurred while refreshing the token.";
        alert(errorMessage);
        if (
          refreshError.response &&
          (refreshError.response.status === 401 ||
            refreshError.response.status === 403)
        ) {
          navigate("/login");
        }
      }
    } else {
      console.log(error);
      const errorMessage = error.response
        ? JSON.stringify(error.response.data)
        : "An error occurred while refreshing the token";
      alert(`An error ocurred: ${errorMessage}`);
    }
  };

  const handleErrorDelete = async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const tokenData = await refreshToken();
        localStorage.setItem("access_token", tokenData.access);
        console.log("Token refreshed.");
        const data = await deleteAccount(formPasswordData.currentPassword);
        console.log(data);
        alert("Account deleted successfully!");
        toggleShowPassword();
      } catch (refreshError) {
        const errorMessage = refreshError.response
          ? JSON.stringify(refreshError.response.data)
          : "An error occurred while refreshing the token.";
        alert(errorMessage);
        if (
          refreshError.response &&
          (refreshError.response.status === 401 ||
            refreshError.response.status === 403)
        ) {
          navigate("/login");
        }
      }
    } else {
      console.log(error);
      const errorMessage = error.response
        ? JSON.stringify(error.response.data)
        : "An error occurred while refreshing the token";
      alert(`An error ocurred: ${errorMessage}`);
    }
  };

  return currentUser ? (
    <>
      <div className="d-flex align-items-center justify-content-center mt-5">
        <h1>Hello, {currentUser}! What do you want to do?</h1>
      </div>
      <div className="d-flex align-items-center justify-content-center mt-5">
        <MDBBtn
          onClick={() => {
            toggleShowPassword();
          }}
        >
          Change password
        </MDBBtn>
      </div>
      <div className="d-flex align-items-center justify-content-center mt-3">
        <MDBBtn onClick={toggleShowAccount}>Delete account</MDBBtn>
      </div>
      <MDBModal
        show={showModalPassword}
        setShow={setShowModalPassword}
        tabIndex="-1"
      >
        <MDBModalDialog className="modal-lg">
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>
                Please enter the required information
              </MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={() => {
                  toggleShowPassword();
                }}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleChangePassword();
                }}
                className="align-items-center"
              >
                <MDBInput
                  className="mt-3"
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  label="Current password"
                  maxLength={66} // bytes32 length in hexadecimal
                  pattern="^(?!\d+$).{8,}"
                  value={formPasswordData.currentPassword}
                  onChange={handleFormPasswordChange}
                  required
                />
                <MDBInput
                  className="mt-3"
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  label="New password"
                  maxLength={66} // bytes32 length in hexadecimal
                  pattern="^(?!\d+$).{8,}"
                  value={formPasswordData.newPassword}
                  onChange={handleFormPasswordChange}
                  required
                />
                <MDBInput
                  className="mt-3"
                  type="password"
                  id="checkNewPassword"
                  name="checkNewPassword"
                  label="Confirm new password"
                  maxLength={66} // bytes32 length in hexadecimal
                  pattern="^(?!\d+$).{8,}"
                  value={formPasswordData.checkNewPassword}
                  onChange={handleFormPasswordChange}
                  required
                />

                <MDBBtn type="submit" className="mt-4" block>
                  Change password
                </MDBBtn>
              </form>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
      <MDBModal
        show={showModalAccount}
        setShow={setShowModalAccount}
        tabIndex="-1"
      >
        <MDBModalDialog className="modal-md text-white">
          <MDBModalContent>
            <MDBModalHeader className="bg-danger">
              <MDBModalTitle>
                All your information will be deleted from our database (not the
                blockchain). Are you sure?
              </MDBModalTitle>

              <MDBBtn
                className="btn-close"
                color="none"
                onClick={() => {
                  toggleShowAccount();
                }}
              ></MDBBtn>
            </MDBModalHeader>

            <MDBModalBody>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleDeleteAccount();
                }}
                className="align-items-center"
              >
                <MDBInput
                  className="mt-3"
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  label="Password"
                  maxLength={66} // bytes32 length in hexadecimal
                  pattern="^(?!\d+$).{8,}"
                  value={formPasswordData.currentPassword}
                  onChange={handleFormPasswordChange}
                  required
                />

                <MDBBtn type="submit" className="mt-4 btn-danger" block>
                  Delete account
                </MDBBtn>
              </form>
            </MDBModalBody>

            <MDBModalFooter className="d-flex justify-content-center">
              <MDBBtn
                className="btn btn-outline-danger"
                color="secondary"
                onClick={() => {
                  toggleShowAccount();
                }}
              >
                Cancel
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  ) : (
    <NotLoggedInComponent />
  );
};

export default Account;
