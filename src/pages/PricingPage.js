import React from "react";
// import CouponApply from "../components/PricingPage/CouponApply";
import PricingBox from "../components/PricingPage/PricingBox";
import "./PricingPage.css";

const PricingPage = (props) => {
  const user = props.user;
  return (
    <>
      <div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
        <h1 className="display-4">Upgrade</h1>
        <p className="lead">
          Hey <b>{user.name.split(" ")[0]}</b>. We're here to support your mental health journey with personalized AI guidance. Your well-being is our priority. Reach out anytime for help.
          <br />Support: <b>powertherapyai@gmail.com</b> 
        </p>
      </div>
      <div className="container">
        <PricingBox user={user}/>
        {/* <CouponApply /> */}
      </div>
    </>
  );
};

export default PricingPage;
