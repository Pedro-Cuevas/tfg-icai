import React, { useState } from "react";
import { ethers } from "ethers";
import {
  MDBInput,
  MDBBtn,
  MDBTextArea,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
} from "mdb-react-ui-kit";
import documentProofABI from "../assets/documentProofABI.json";
import HashGenerator from "./HashGenerator";

const CONTRACT_ADDRESS = "0xb9a219631aed55ebc3d998f17c3840b7ec39c0cc"; // HAY QUE MOVERLO A OTRO SITIO

const Upload = () => {
  const [formData, setFormData] = useState({
    _hash: "",
    _size: 0,
    _ownerName: "",
    _title: "",
    _description: "",
  });

  const setHash = (hash) => {
    setFormData({ ...formData, _hash: hash });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents default refresh by the browser
    console.log(formData);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        documentProofABI,
        signer
      );

      const tx = await contract.newInstance(
        formData._hash,
        formData._size,
        formData._ownerName,
        formData._title,
        formData._description
      );
      console.log("Transaction hash:", tx.hash);

      await tx.wait();
      console.log("Transaction confirmed.");
      alert("Transaction confirmed! Information uploaded to the blockchain");
    } catch (error) {
      console.error("Error uploading information:", error);
      alert("Error uploading information: " + error.message);
    }
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-center mt-5">
        <MDBCard style={{ maxWidth: "45rem" }}>
          <MDBCardHeader color="dark">
            <h4>Upload a new instance into the blockchain</h4>
          </MDBCardHeader>
          <MDBCardBody>
            <p>
              Be careful when uploading information to the blockchain. It will
              be stored forever and it will be public.
            </p>
          </MDBCardBody>
        </MDBCard>
      </div>
      <div className="d-flex align-items-center justify-content-center mt-5 mb-3">
        <HashGenerator setHashParent={setHash} />
      </div>
      <div className="d-flex align-items-center justify-content-center mt-5">
        <form
          onSubmit={handleSubmit}
          className="col-lg-4 col-md-10 col-sm-10 col-10"
        >
          <MDBInput
            className="mb-4"
            type="text"
            id="_hash"
            name="_hash"
            label="Hash"
            maxLength={66} // bytes32 length in hexadecimal
            pattern="^0x[a-fA-F0-9]{64}$" // Ensure it starts with 0x and followed by 64 hexadecimal characters
            value={formData._hash}
            onChange={handleChange}
            required
          />
          <MDBInput
            type="number"
            className="mb-4"
            id="_size"
            name="_size"
            label="Size"
            value={formData._size}
            onChange={handleChange}
            required
          />
          <MDBInput
            type="text"
            className="mb-4"
            id="_ownerName"
            name="_ownerName"
            label="Owner"
            value={formData._ownerName}
            onChange={handleChange}
            required
          />
          <MDBInput
            type="text"
            className="mb-4"
            id="_title"
            name="_title"
            label="Title"
            value={formData._title}
            onChange={handleChange}
            required
          />
          <MDBTextArea
            className="mb-4"
            id="_description"
            name="_description"
            rows={4}
            label="Description"
            value={formData._description}
            onChange={handleChange}
            required
          />

          <MDBBtn type="submit" className="mb-4" block>
            Upload instance
          </MDBBtn>
        </form>
      </div>
    </>
  );
};

export default Upload;
