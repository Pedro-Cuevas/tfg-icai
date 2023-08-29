import React from "react";
import { Link } from "react-router-dom";

const NotLoggedInComponent = () => (
  <>
    <div className="d-flex align-items-center justify-content-center mt-5">
      <h1>Not logged in!</h1>
    </div>
    <div className="d-flex align-items-center justify-content-center mt-2">
      <p>
        You need to <Link to="/login">log in</Link> to see this page.
      </p>
    </div>
  </>
);

export default NotLoggedInComponent;
