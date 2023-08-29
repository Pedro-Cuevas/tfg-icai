import React, { useState } from "react";
import {
  MDBTable,
  MDBBtn,
  MDBTableHead,
  MDBTableBody,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalFooter,
  MDBInput,
  MDBModalBody,
  MDBTextArea,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { deleteHash, editHash } from "./apiServices";

const DataTable = ({ hashData, setHashData }) => {
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedHash, setSelectedHash] = useState({
    id: "",
    hash_value: "",
    description: "",
    user: "",
  });
  const toggleShowDelete = () => setDeleteModal(!deleteModal);
  const toggleShowEdit = () => setEditModal(!editModal);

  const handleChangeEdit = (e) => {
    setSelectedHash({ ...selectedHash, [e.target.name]: e.target.value });
  };

  const handleDelete = async () => {
    try {
      await deleteHash(selectedHash.id);
      setHashData(hashData.filter((item) => item.id !== selectedHash.id)); // this line allows to update the table without refreshing the page
    } catch (error) {
      // Handle error (e.g., token expiration or other API issues)
      console.log(error);
    }
    toggleShowDelete();
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await editHash(
        selectedHash.id,
        selectedHash.hash_value,
        selectedHash.description
      );
      // update hash in hashData
      setHashData(
        hashData.map((item) =>
          item.id === selectedHash.id ? selectedHash : item
        )
      );
    } catch (error) {
      // Handle error (e.g., token expiration or other API issues)
      console.log(error);
    }
    toggleShowEdit();
  };

  return hashData && hashData.length > 0 ? (
    <>
      <div className="d-flex align-items-center justify-content-center mt-5">
        <MDBTable>
          <MDBTableHead>
            <tr>
              <th>Hash Value</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {hashData.map((item) => (
              <tr key={item.id}>
                <td>{item.hash_value}</td>
                <td>{item.description}</td>
                <td>
                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setSelectedHash(item);
                        toggleShowEdit();
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => {
                        setSelectedHash(item);
                        console.log(selectedHash);
                        toggleShowDelete();
                      }}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="btn btn-info"
                      onClick={() => {
                        navigate("/get-instance", {
                          state: { hash: item.hash_value },
                        });
                      }}
                    >
                      Search in the blockchain
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </MDBTableBody>
        </MDBTable>
      </div>
      <MDBModal show={editModal} setShow={setEditModal} tabIndex="-1">
        <MDBModalDialog className="modal-lg">
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>
                Please modify your saved information
              </MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={() => {
                  toggleShowEdit();
                }}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <form onSubmit={handleEdit} className="align-items-center">
                <MDBInput
                  className="mt-3"
                  type="text"
                  id="hash_value"
                  name="hash_value"
                  label="Stored hash"
                  maxLength={66} // bytes32 length in hexadecimal
                  pattern="^0x[a-fA-F0-9]{64}$" // Ensure it starts with 0x and followed by 64 hexadecimal characters
                  required
                  value={selectedHash.hash_value} // initial value: the hash value of the selected hash
                  onChange={handleChangeEdit}
                />
                <MDBTextArea
                  className="mt-3"
                  id="description"
                  name="description"
                  rows={4}
                  label="Description"
                  value={selectedHash.description} // initial value: the description of the selected hash
                  onChange={handleChangeEdit}
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
      <MDBModal show={deleteModal} setShow={setDeleteModal} tabIndex="-1">
        <MDBModalDialog className="modal-sm text-white">
          <MDBModalContent>
            <MDBModalHeader className="bg-danger">
              <MDBModalTitle>Delete stored hash?</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={() => {
                  toggleShowDelete();
                }}
              ></MDBBtn>
            </MDBModalHeader>

            <MDBModalFooter className="d-flex justify-content-center">
              <MDBBtn
                className="btn btn-outline-danger"
                color="secondary"
                onClick={() => {
                  toggleShowDelete();
                }}
              >
                Cancel
              </MDBBtn>
              <MDBBtn
                className="btn btn-danger"
                onClick={() => {
                  handleDelete();
                }}
              >
                Delete
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  ) : (
    <div className="d-flex align-items-center justify-content-center mt-5">
      <h1>No hashes stored!</h1>
    </div>
  );
};

export default DataTable;
