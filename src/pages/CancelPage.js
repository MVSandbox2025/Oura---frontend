import React from "react";
import { Link } from "react-router-dom";
import "./SuccessCancel.css"; // Importing shared CSS styles

function CancelPage() {
  return (
    <div className="card1">
      <h1>Payment Canceled</h1>
      <p>Your transaction has been canceled.</p>
      <Link to="/" className="button1">
        Return to Home Page
      </Link>
    </div>
  );
}

export default CancelPage;
