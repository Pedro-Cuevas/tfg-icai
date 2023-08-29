import React, { useState } from "react";
import { ethers } from "ethers";
import {
  MDBInput,
  MDBBtn,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBCardText,
  MDBTextArea,
} from "mdb-react-ui-kit";
import documentProofABI from "../assets/documentProofABI.json";
import HashGenerator from "./HashGenerator";

//ARCHIVO DEMASIADO GRANDE -> MOVER ELEMENTOS FUERA E IMPORTAR
//APLICAR DRY

const CONTRACT_ADDRESS = "0xb9a219631aed55ebc3d998f17c3840b7ec39c0cc"; // HAY QUE MOVERLO A OTRO SITIO
const PROVIDER_URL = "http://185.180.8.164:8545"; //public endpoint from Alastria's Github. MOVER TAMBIÉN

const EditInstance = () => {
  const [formHash, setFormHash] = useState("");
  const [contractHash, setContractHash] = useState(null);
  const [contractData, setContractData] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [validity, setValidity] = useState("none");
  const [size, setSize] = useState("");
  const [owner, setOwner] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleChangeValidity = (e) => {
    const v = e.target.value;
    setValidity(v);
    console.log(v);
  };

  const handleChangeSize = (e) => {
    setSize(e.target.value);
  };

  const handleChangeHash = (e) => {
    setFormHash(e.target.value);
  };

  const handleChangeOwner = (e) => {
    setOwner(e.target.value);
  };

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmitHash = async (e) => {
    e.preventDefault();
    console.log(formHash);
    setContractHash(formHash);
    try {
      const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        documentProofABI,
        provider
      );

      // If getInstance is a view/call method:
      const result = await contract.getInstance(formHash);
      console.log("Result from contract:", result);
      setContractData(result);

      // No need to wait since it's not a transaction
    } catch (error) {
      console.error("Error fetching contract data:", error);
      alert("Error fetching contract data: " + error.message);
    }
  };

  const getContractWithSigner = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        documentProofABI,
        signer
      );
      return contract;
    } catch (error) {
      console.error("Error getting Contract:", error);
      throw error;
    }
  };

  const editContract = async (e) => {
    e.preventDefault(); // Prevents default refresh by the browser
    try {
      const contract = await getContractWithSigner();
      let tx;
      switch (selectedOption) {
        case "Validity":
          if (validity === "none") return; //OPTIMIZAR Y AMPLIAR AL RESTO DEL CÓDIGO
          tx = await contract.setIsValid(contractHash, validity === "true");
          console.log("Transaction hash:", tx.hash);
          await tx.wait();
          console.log("Transaction confirmed.");
          handleSubmitHash(e);
          break;
        case "Size":
          tx = await contract.setSize(contractHash, size);
          console.log("Transaction hash:", tx.hash);
          await tx.wait();
          console.log("Transaction confirmed.");
          handleSubmitHash(e);
          break;
        case "Owner":
          tx = await contract.setOwnerName(contractHash, owner);
          console.log("Transaction hash:", tx.hash);
          await tx.wait();
          console.log("Transaction confirmed.");
          handleSubmitHash(e);
          break;
        case "Title":
          tx = await contract.setTitle(contractHash, title);
          console.log("Transaction hash:", tx.hash);
          await tx.wait();
          console.log("Transaction confirmed.");
          handleSubmitHash(e);
          break;
        case "Description":
          tx = await contract.setDescription(contractHash, description);
          console.log("Transaction hash:", tx.hash);
          await tx.wait();
          console.log("Transaction confirmed.");
          handleSubmitHash(e);
          break;
      }
      alert("Transaction confirmed! Your data has been modified correctly!");
    } catch (error) {
      if (error.message.includes("Hash is not mapped")) {
        alert("The hash you are looking for was not found in the blockchain.");
      } else {
        alert("Error fetching contract data: " + error.message);
      }
    }
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-center mt-5">
        <MDBCard style={{ maxWidth: "45rem" }}>
          <MDBCardHeader color="dark">
            <h4>Edit a generated instance</h4>
          </MDBCardHeader>
          <MDBCardBody>
            <p>
              In this section you can edit the metadata of an instance
              generated. You will need to sign the transaction with the same
              account that uploaded the information.
            </p>
          </MDBCardBody>
        </MDBCard>
      </div>
      <div className="d-flex align-items-center justify-content-center mt-5 mb-3">
        <HashGenerator setHashParent={setFormHash} />
      </div>
      <div className="d-flex align-items-center justify-content-center mt-5">
        <label className="d-block mb-3">
          Please enter the hash of the document you want to edit
        </label>
      </div>
      <div className="d-flex align-items-center justify-content-center">
        <form
          onSubmit={handleSubmitHash}
          className="col-lg-6 col-md-9 col-sm-10 col-10 d-flex align-items-center justify-content-between gap-2"
        >
          {/* Wrapper div with margin */}
          <MDBInput
            type="text"
            id="form2Example1"
            label="Stored hash"
            maxLength={66} // bytes32 length in hexadecimal
            pattern="^0x[a-fA-F0-9]{64}$" // Ensure it starts with 0x and followed by 64 hexadecimal characters
            required
            value={formHash}
            onChange={handleChangeHash}
          />
          <MDBBtn type="submit">Retrieve</MDBBtn>
        </form>
      </div>

      <div className="d-flex align-items-center justify-content-center mt-4">
        {/* Displaying contract data when available */}
        {contractData && (
          <MDBCard style={{ maxWidth: "45rem" }}>
            <MDBCardHeader color="dark">
              Instance data for hash: {contractHash}
            </MDBCardHeader>
            <MDBCardBody>
              <MDBCardText>
                <strong>Date:</strong>{" "}
                {new Date(Number(contractData[0]) * 1000).toLocaleString()}
              </MDBCardText>
              <MDBCardText>
                <strong>Size:</strong> {Number(contractData[1]).toString()}
              </MDBCardText>
              <MDBCardText>
                <strong>Owner name:</strong> {contractData[2]}
              </MDBCardText>
              <MDBCardText>
                <strong>Title:</strong> {contractData[3]}
              </MDBCardText>
              <MDBCardText>
                <strong>Description:</strong> {contractData[4]}
              </MDBCardText>
              <MDBCardText>
                <strong>Valid:</strong> {contractData[5] ? "Yes" : "No"}
              </MDBCardText>
              <MDBCardText>
                <strong>Owner address:</strong> {contractData[6]}
              </MDBCardText>
            </MDBCardBody>
          </MDBCard>
        )}
      </div>

      {contractData && (
        <>
          <div className="d-flex align-items-center justify-content-center mt-5">
            <label className="d-block mb-3">
              What piece of metadata do you want to edit?
            </label>
          </div>
          <div className="d-flex align-items-center justify-content-center mt-1">
            <div className="btn-group mb-4" role="group">
              <MDBBtn
                onClick={() => {
                  setSelectedOption("Validity");
                }}
              >
                Validity
              </MDBBtn>
              <MDBBtn
                onClick={() => {
                  setSelectedOption("Size");
                }}
              >
                Size
              </MDBBtn>
              <MDBBtn
                onClick={() => {
                  setSelectedOption("Owner");
                }}
              >
                Owner
              </MDBBtn>
              <MDBBtn
                onClick={() => {
                  setSelectedOption("Title");
                }}
              >
                Title
              </MDBBtn>
              <MDBBtn
                onClick={() => {
                  setSelectedOption("Description");
                }}
              >
                Description
              </MDBBtn>
            </div>
          </div>

          {selectedOption === "Validity" && (
            <div className="d-flex align-items-center justify-content-center">
              <form
                onSubmit={editContract}
                className="d-flex align-items-center justify-content-between gap-2"
              >
                {/* Wrapper div with margin */}
                <select className="form-select" onChange={handleChangeValidity}>
                  <option value="none">Please select an option</option>
                  <option value="true">
                    The instance is valid (stored as true)
                  </option>
                  <option value="false">
                    The instance is not valid (stored as false)
                  </option>
                </select>

                <MDBBtn type="submit">Submit</MDBBtn>
              </form>
            </div>
          )}

          {selectedOption === "Size" && (
            <div className="d-flex align-items-center justify-content-center">
              <form
                onSubmit={editContract}
                className="d-flex align-items-center justify-content-between gap-2"
              >
                <MDBInput
                  type="number"
                  id="_size"
                  name="_size"
                  label="size"
                  value={size}
                  onChange={handleChangeSize}
                  required
                />

                <MDBBtn type="submit">Submit</MDBBtn>
              </form>
            </div>
          )}

          {selectedOption === "Owner" && (
            <div className="d-flex align-items-center justify-content-center">
              <form
                onSubmit={editContract}
                className="d-flex align-items-center justify-content-between gap-2"
              >
                <MDBInput
                  type="text"
                  id="_owner"
                  name="_owner"
                  label="owner"
                  value={owner}
                  onChange={handleChangeOwner}
                  required
                />

                <MDBBtn type="submit">Submit</MDBBtn>
              </form>
            </div>
          )}

          {selectedOption === "Title" && (
            <div className="d-flex align-items-center justify-content-center">
              <form
                onSubmit={editContract}
                className="d-flex align-items-center justify-content-between gap-2"
              >
                <MDBInput
                  type="text"
                  id="_title"
                  name="_title"
                  label="title"
                  value={title}
                  onChange={handleChangeTitle}
                  required
                />

                <MDBBtn type="submit">Submit</MDBBtn>
              </form>
            </div>
          )}

          {selectedOption === "Description" && (
            <div className="d-flex align-items-center justify-content-center">
              <form
                onSubmit={editContract}
                className="d-flex align-items-center justify-content-between gap-2"
              >
                <MDBTextArea
                  id="_description"
                  name="_description"
                  rows={3}
                  label="description"
                  value={description}
                  onChange={handleChangeDescription}
                  required
                />

                <MDBBtn type="submit">Submit</MDBBtn>
              </form>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default EditInstance;
