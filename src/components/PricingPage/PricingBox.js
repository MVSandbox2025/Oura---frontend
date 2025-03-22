import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ToggleButtonGroup from "@mui/joy/ToggleButtonGroup";
import Button from "@mui/joy/Button";
import { loadStripe } from "@stripe/stripe-js";

const PricingBox = (props) => {
  const user = props.user
  const [priceToggle, setPriceToggle] = useState("Yearly");
  const [subscription, setSubscription] = useState(null);

  const checkUserSubscription = async (email) => {
    try {
      // console.log(email)
      fetch(`https://oura-backend.onrender.com/api/paymentinfo?email=${email}`)
        .then((response) => response.json())
        .then((data) => {
          setSubscription(data?.user);
        })
        .catch((error) => console.error("Error:", error));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    { user && checkUserSubscription(user.email) }
  }, []);
  const navigate = useNavigate();

  const pricingMenu = [
    {
      title: "Support",
      priceYear: 0,
      priceMonth: 0,
      feature: [
        <span>
          Chat for upto <strong>3K</strong> Words/Month
        </span>,

      ],
    },
    {
      title: "Enhance",
      priceYear: 19.99,
      priceMonth: 34.99,
      feature: [
        <span>
          Chat for upto <strong>40K</strong> Words/Month
        </span>,

      ],
    },
    {
      title: "Empower",
      priceYear: 34.99,
      priceMonth: 54.99,
      feature: [
        <span>
          Chat for upto <strong>130K</strong> Words/Month
        </span>,

      ],
    },
  ];
  const paymentHandler = async (menu) => {
    const stripe = await loadStripe(
      "pk_live_51PCOvYIswOuIsGoZfq2ctL7Skd1IN7IAV8QzG6hBeM6Lq3hHTalnPbXFL3dWa09AfHCZN42dlWzQZ4K1sjYIzn9100Fi1UPtY7"
    );
    const body = {
      name:
        priceToggle === "Monthly"
          ? menu.title + " Monthly"
          : menu.title + " Yearly",
      price: priceToggle === "Monthly" ? menu.priceMonth : menu.priceYear * 12,
      email: user.email
    };
    console.log(body.name , body.price , body.email)
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await fetch("https://oura-backend.onrender.com/api/payment-session", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      console.log("HTTP error status:", response);
      throw new Error("Network response was not ok: " + response.status);
    }
    const session = await response.json();
    localStorage.setItem("session_id", session.id); // Store session ID securely
    console.log("id in pricing", session.id);
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
    if (result.error) console.log("ERROR: ", result.error);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "2%",
        }}
      >
        <ToggleButtonGroup
          value={priceToggle}
          onChange={(event, newValue) => {
            setPriceToggle(newValue);
          }}
        >
          <Button value="Yearly">Yearly</Button>
          <Button value="Monthly">Monthly</Button>
        </ToggleButtonGroup>
      </div>

      <div className="card-deck mb-3 text-center">
        {pricingMenu.map((menu, id) => {
          if (menu.title === "Support" && priceToggle === "Yearly") {
            return null;
          }
          return (
            <div className="card mb-4 shadow-sm" key={id}>
              <div className="card-header">
                <h4 className="my-0 font-weight-normal">{menu.title}</h4>
              </div>
              <div className="card-body">
                <h1 className="card-title pricing-card-title">
                  ${priceToggle === "Yearly" ? menu.priceYear : menu.priceMonth}
                  <small className="text-muted">
                    {priceToggle === "Yearly" ? " / month" : " / month"}
                  </small>
                </h1>
                <ul className="list-unstyled mt-3 mb-4">
                  {menu.feature.map((data, i) => {
                    return <li key={i}>{data}</li>;
                  })}
                </ul>
                <button
                  onClick={() => paymentHandler(menu)}
                  type="button"
                  className={`btn btn-lg btn-block  ${
                    (subscription?.productName === menu.title ||
                    subscription?.productName === menu.title + " " + priceToggle) 
                    ? "btn-primary" 
                    : "btn-outline-primary"
                  }`}
                
                >
                  {subscription?.productName === menu.title
                    ? "Current"
                    : subscription?.productName === menu.title + " " + priceToggle
                      ? "Current"
                      : "Get Started"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PricingBox;
