import React, { useState } from "react";
import style from "./CouponApply.module.css";

const CouponApply = () => {
  const [couponCode, setCouponCode] = useState("");
  const [message, setMessage] = useState("");

  const inputChangeHandler = (e) => {
    if (message !== "") setMessage("");
    setCouponCode(e.target.value);
  };
  const applyCouponHandler = (e) => {
    e.preventDefault();
    ////////////////// API call to validate coupon code
    if (couponCode === "SAVE10") {
      setMessage("Coupon applied successfully! You saved 10%.");
    } else {
      setMessage("Invalid coupon code. Please try again.");
    }
  };

  return (
    <div className={style.main}>
      <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
        Apply a Coupon and get amazing discounts.
      </div>
      <form style={{ marginBottom: "10px" }} onSubmit={applyCouponHandler}>
        <input
          type="text"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={inputChangeHandler}
          className={style.input}
        />
        <button type="submit" className={style.btn}>
          Apply
        </button>
      </form>
      {message && (
        <div style={{ color: couponCode === "SAVE10" ? "green" : "red" }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default CouponApply;
