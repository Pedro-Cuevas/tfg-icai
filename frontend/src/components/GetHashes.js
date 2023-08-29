import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import documentProofABI from "../assets/documentProofABI.json";
import {
  MDBInput,
  MDBBtn,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBCardText,
} from "mdb-react-ui-kit";

const CONTRACT_ADDRESS = "0xb9a219631aed55ebc3d998f17c3840b7ec39c0cc"; // HAY QUE MOVERLO A OTRO SITIO
const PROVIDER_URL = "http://185.180.8.164:8545"; //public endpoint from Alastria's Github. MOVER TAMBIÉN

const GetHashes = () => {
  const [formData, setFormData] = useState("");
  const [contractData, setContractData] = useState(null);

  const handleChange = (e) => {
    setFormData(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        documentProofABI,
        provider
      );

      // Since getInstance is a view/call method:
      const result = await contract.getHashes(formData);
      console.log("Result from contract:", result);
      setContractData(result);

      // No need to wait since it's not a transaction
    } catch (error) {
      console.error("Error fetching contract data:", error);
      alert("Error fetching contract data: " + error.message);
    }
  };
  return (
    <>
      <div className="d-flex align-items-center justify-content-center mt-5">
        <MDBCard style={{ maxWidth: "45rem" }}>
          <MDBCardHeader color="dark">
            <h4>Look for an account's hashes in the blockchain</h4>
          </MDBCardHeader>
          <MDBCardBody>
            <p>
              You can use this tool to look for an account's hashes in the
              blockchain. If the account has stored hashes, they will be
              displayed below.
            </p>
          </MDBCardBody>
        </MDBCard>
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
            label="Address"
            maxLength={42} // address length in hexadecimal
            pattern="^0x[a-fA-F0-9]{40}$" // Ensure it starts with 0x and followed by 64 hexadecimal characters
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
              Stored hashes retrieved from Alastria's B network
            </MDBCardHeader>
            <MDBCardBody>
              {contractData.length === 0 ? (
                <MDBCardText>
                  This account has not stored any hashes in the blockchain.
                </MDBCardText>
              ) : (
                contractData.map((hash, index) => (
                  <>
                    <MDBCardText key={index}>
                      Hash {index + 1}:{" "}
                      <Link
                        to="/get-instance"
                        state={{ hash: hash }}
                        className="text-info ml-2"
                        style={{ textDecoration: "underline" }}
                      >
                        {hash}
                      </Link>
                    </MDBCardText>
                  </>
                ))
              )}
            </MDBCardBody>
          </MDBCard>
        )}
      </div>
    </>
  );
};

export default GetHashes;
