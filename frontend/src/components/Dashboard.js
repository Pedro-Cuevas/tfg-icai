import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchHashes, refreshToken, saveHash } from "./apiServices";
import DataTable from "./DataTable";
import LoadingComponent from "./LoadingComponent";
import NotLoggedInComponent from "./NotLoggedInComponent";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBInput,
  MDBModalBody,
  MDBTextArea,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
} from "mdb-react-ui-kit";

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [hashData, setHashData] = useState(null);
  const [hashValue, setHashValue] = useState("");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const toggleShow = () => {
    setShowModal(!showModal);
  };

  const handleHashChange = (e) => {
    setHashValue(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      try {
        const data = await fetchHashes();
        setHashData(data);
      } catch (error) {
        handleFetchError(error);
      }
    };

    const handleFetchError = async (error) => {
      if (error.response && error.response.status === 401) {
        try {
          const tokenData = await refreshToken();
          localStorage.setItem("access_token", tokenData.access);
          console.log("Token refreshed.");
          const data = await fetchHashes();
          setHashData(data);
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
        const errorMessage = error.response
          ? JSON.stringify(error.response.data)
          : "An error occurred.";
        alert(`Error fetching data: ${errorMessage}`);
      }
    };

    fetchData();
  }, [currentUser, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      //check if hashValue is already in hashData
      for (let i = 0; i < hashData.length; i++) {
        if (hashData[i].hash_value === hashValue) {
          alert("Hash already saved!");
          return;
        }
      }
      const newHash = await saveHash(hashValue, description);
      alert("Information saved successfully!");
      // add to hashdata
      setHashData([...hashData, newHash]);
      toggleShow();
    } catch (error) {
      console.log(error);
      handleSaveError(error);
    }
  };

  const handleSaveError = async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const tokenData = await refreshToken();
        localStorage.setItem("access_token", tokenData.access);
        console.log("Token refreshed.");
        const newHash = await saveHash(hashValue, description);
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
      const errorMessage = error.response
        ? JSON.stringify(error.response.data)
        : "An error occurred.";
      alert(`Error saving data: ${errorMessage}`);
    }
  };

  return currentUser ? (
    hashData ? (
      <>
        <div className="d-flex align-items-center justify-content-center mt-5">
          <MDBCard style={{ maxWidth: "100rem" }}>
            <MDBCardHeader color="dark">
              <h4>Manage your stored data</h4>
            </MDBCardHeader>
            <MDBCardBody>
              <p>
                You can use this tool to manage the information that you store
                in our server. This information is not in the blockchain.
              </p>
            </MDBCardBody>
          </MDBCard>
        </div>
        <DataTable hashData={hashData} setHashData={setHashData} />
        <div className="d-flex align-items-center justify-content-center mt-4">
          <MDBBtn onClick={toggleShow}>Save new hash</MDBBtn>
        </div>
        <MDBModal show={showModal} setShow={setShowModal} tabIndex="-1">
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
                    toggleShow();
                  }}
                ></MDBBtn>
              </MDBModalHeader>
              <MDBModalBody>
                <form onSubmit={handleSave} className="align-items-center">
                  <MDBInput
                    className="mt-3"
                    type="text"
                    id="hash_value"
                    name="hash_value"
                    label="Hash"
                    maxLength={66} // bytes32 length in hexadecimal
                    pattern="^0x[a-fA-F0-9]{64}$" // Ensure it starts with 0x and followed by 64 hexadecimal characters
                    value={hashValue} // initial value: the hash value of the selected hash
                    onChange={handleHashChange}
                    required
                  />
                  <MDBTextArea
                    className="mt-3"
                    id="description"
                    name="description"
                    rows={4}
                    label="Description"
                    value={description} // initial value: the description of the selected hash
                    onChange={handleDescriptionChange}
                    required
                  />

                  <MDBBtn type="submit" className="mt-4" block>
                    Update
                  </MDBBtn>
                </form>
              </MDBModalBody>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      </>
    ) : (
      <LoadingComponent />
    )
  ) : (
    <NotLoggedInComponent />
  );
};

export default Dashboard;
