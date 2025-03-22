import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./SuccessCancel.css"; // Importing shared CSS styles

function SuccessPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const sessionId = localStorage.getItem("session_id");
    if (sessionId) {
      fetch(`https://oura-backend.onrender.com/api/success?session_id=${sessionId}`)
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((error) => console.error("Error:", error));
    }
    localStorage.removeItem("session_id");
  }, []);

  if (!data) return <div className="loader"></div>;

  return (
    <>
      <div className="card1">
        <h1>Payment Successful!</h1>
        <p>Your payment has been processed successfully.</p>
        <Link to="/" className="button1">
          Return to Home Page
        </Link>
      </div>
      <h6
        style={{
          width: "fit-content",
          margin: "auto",
          marginTop: "100px",
          padding: "5px",
          borderBottom: "2px solid black",
          borderTop: "2px solid black",
        }}
      >
        Hello {data.name} with Email: {data.email} , You have subscribed to{" "}
        <b>{data.productName}</b> plan
      </h6>
    </>
  );
}

export default SuccessPage;
