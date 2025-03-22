import React from "react";
import Button from "@mui/material/Button";
import GoogleIcon from "@mui/icons-material/Google";
import style from "./LoginPage.module.css"; // Import the CSS for additional styling
import { Avatar, Divider } from "@mui/material";
import OuraLogo from "../assets/ouraLogo.jpeg";

const login = () => {
  const handleSend = () => {
    window.open("https://oura-backend.onrender.com/auth/google", "_self");
  };
  return (
    <div className={style["login-container"]}>
      <div data-aos="zoom-out-down" data-aos-duration="3000">
        <Avatar
          src={OuraLogo}
          alt="AI"
          style={{ transform: "scale(4)", marginBottom: "45px" }}
        />
      </div>

      <h1 data-aos="fade-up" data-aos-duration="2000" className={style.title}>
        Welcome to Oura AI
      </h1>
      <Divider data-aos="fade-up" data-aos-duration="2000">
        Login to Continue.
      </Divider>
      <br />
      <Button
        data-aos="fade-up"
        data-aos-duration="3000"
        variant="contained"
        startIcon={<GoogleIcon />}
        onClick={handleSend}
      >
        Login with Google
      </Button>
      <a href="https://www.google.com">
        <button>Go to Google</button>
      </a>
    </div>
  );
};

export default login;
