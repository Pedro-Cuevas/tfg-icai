import Home from "./components/Home";
import Upload from "./components/Upload";
import GetHashes from "./components/GetHashes";
import GetInstance from "./components/GetInstance";
import EditInstance from "./components/EditInstance";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import React, { useState } from "react";
import Account from "./components/Account";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBCollapse,
  MDBFooter,
} from "mdb-react-ui-kit";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const [showNavRight, setShowNavRight] = useState(false);
  const { currentUser, handleLogout } = useAuth(); // Destructure the currentUser and logout object from the context

  return (
    <>
      <MDBNavbar expand="md" dark bgColor="primary">
        <MDBContainer fluid>
          <MDBNavbarBrand href="/">DocumentProof interaction</MDBNavbarBrand>

          <MDBNavbarToggler
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => setShowNavRight(!showNavRight)}
          >
            <MDBIcon icon="bars" fas />
          </MDBNavbarToggler>

          <MDBCollapse navbar show={showNavRight}>
            <MDBNavbarNav right fullWidth={false} className="mb-2 mb-lg-0">
              <MDBNavbarItem>
                <MDBNavbarLink aria-current="page" href="/">
                  Home
                </MDBNavbarLink>
              </MDBNavbarItem>

              <MDBNavbarItem>
                <MDBDropdown>
                  <MDBDropdownToggle tag="a" className="nav-link" role="button">
                    Interact with the smart contract
                  </MDBDropdownToggle>
                  <MDBDropdownMenu>
                    <MDBDropdownItem link href="/get-instance">
                      Retrieve instance
                    </MDBDropdownItem>
                    <MDBDropdownItem link href="/get-hashes">
                      Retrive hashes uploaded by address
                    </MDBDropdownItem>
                    <MDBDropdownItem link href="/upload">
                      Upload instance
                    </MDBDropdownItem>
                    <MDBDropdownItem link href="/edit-instance">
                      Edit instance metadata
                    </MDBDropdownItem>
                  </MDBDropdownMenu>
                </MDBDropdown>
              </MDBNavbarItem>
              {/* Only show Login if no currentUser */}
              {!currentUser ? (
                <>
                  <MDBNavbarItem>
                    <MDBNavbarLink aria-current="page" href="/login">
                      Login
                    </MDBNavbarLink>
                  </MDBNavbarItem>
                  <MDBNavbarItem>
                    <MDBNavbarLink aria-current="page" href="/register">
                      Register
                    </MDBNavbarLink>
                  </MDBNavbarItem>
                </>
              ) : (
                <>
                  <MDBNavbarItem>
                    <MDBNavbarLink aria-current="page" href="/dashboard">
                      Dashboard
                    </MDBNavbarLink>
                  </MDBNavbarItem>
                  <MDBNavbarItem>
                    <MDBDropdown>
                      <MDBDropdownToggle
                        tag="a"
                        className="nav-link"
                        role="button"
                      >
                        My account
                      </MDBDropdownToggle>
                      <MDBDropdownMenu>
                        <MDBDropdownItem link onClick={handleLogout}>
                          Logout
                        </MDBDropdownItem>
                        <MDBDropdownItem link href="/account">
                          Account settings
                        </MDBDropdownItem>
                      </MDBDropdownMenu>
                    </MDBDropdown>
                  </MDBNavbarItem>
                </>
              )}
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/get-hashes" element={<GetHashes />} />
        <Route path="/get-instance" element={<GetInstance />} />
        <Route path="/edit-instance" element={<EditInstance />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/account" element={<Account />} />
        {/* Add other routes here */}
      </Routes>
      <MDBFooter color="blue" className="font-small pt-4 mt-4">
        <MDBContainer
          fluid
          className="text-center text-md-left"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
        >
          <div className="text-center py-3">
            © {new Date().getFullYear()} DocumentProof
          </div>
        </MDBContainer>
      </MDBFooter>
    </>
  );
}
