import React, { useState } from "react";
import { ethers } from "ethers";
import { useLocation } from "react-router-dom";
import {
  MDBInput,
  MDBBtn,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBCardText,
} from "mdb-react-ui-kit";
import documentProofABI from "../assets/documentProofABI.json";
import HashGenerator from "./HashGenerator";

const CONTRACT_ADDRESS = "0xb9a219631aed55ebc3d998f17c3840b7ec39c0cc"; // HAY QUE MOVERLO A OTRO SITIO
const PROVIDER_URL = "http://185.180.8.164:8545"; //public endpoint from Alastria's Github. MOVER TAMBIÉN

const GetInstance = () => {
  const location = useLocation();
  const hash = location.state?.hash;
  const [formData, setFormData] = useState(hash || "");
  const [contractData, setContractData] = useState(null);

  const handleChange = (e) => {
    setFormData(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        documentProofABI,
        provider
      );

      // If getInstance is a view/call method:
      const result = await contract.getInstance(formData);
      console.log("Result from contract:", result);
      setContractData(result);

      // No need to wait since it's not a transaction
    } catch (error) {
      console.error("Error fetching contract data:", error);
      console.log("Error fetching contract data: " + error.message);
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
            <h4>Look for a hash in the blockchain</h4>
          </MDBCardHeader>
          <MDBCardBody>
            <p>
              You can use this tool to look for a hash in the blockchain. If the
              hash is found, you will be able to see the document's owner, the
              hash's timestamp, and more useful information.
            </p>
          </MDBCardBody>
        </MDBCard>
      </div>
      <div className="d-flex align-items-center justify-content-center mt-5 mb-3">
        <HashGenerator setHashParent={setFormData} />
      </div>
      <div className="d-flex align-items-center justify-content-center mt-5">
        <form
          onSubmit={handleSubmit}
          className="col-lg-4 col-md-10 col-sm-10 col-10"
        >
          <MDBInput
            className="mb-4"
            type="text"
            id="form2Example1"
            label="Stored hash"
            maxLength={66} // bytes32 length in hexadecimal
            pattern="^0x[a-fA-F0-9]{64}$" // Ensure it starts with 0x and followed by 64 hexadecimal characters
            required
            value={formData}
            onChange={handleChange}
          />

          <MDBBtn type="submit" className="mb-4" block>
            Retrieve
          </MDBBtn>
        </form>
      </div>

      <div className="d-flex align-items-center justify-content-center mt-5">
        {/* Displaying contract data when available */}
        {contractData && (
          <MDBCard style={{ maxWidth: "45rem" }}>
            <MDBCardHeader color="dark">
              Stored data retrieved from Alastria's B network
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
    </>
  );
};

export default GetInstance;
