import "./dashboard.css";
import React, { useState, useEffect } from "react";
import backgroundImage from "./A.png";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import Avatar from "@mui/material/Avatar";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  Menu,
  MenuItem,
  MenuList,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import BoltIcon from "@mui/icons-material/Bolt";
import OuraLogo from "../assets/ouraLogo.jpeg";
import { useNavigate } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import PricingBox from "./PricingPage/PricingBox";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
// import axios from 'axios';

const Dashboard = (props) => {
  const user = props.user;
  const navigate = useNavigate();

  const [history, setIsHistory] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [status, setStatus] = useState(null);
  const [open, setOpen] = useState(false);
  const [openD, setOpenD] = React.useState(false);
  const [alertMsg, setAlertMsg] = React.useState(false);

  const [messages, setMessage] = useState(null);

  const checkWords = async (input) => {
    console.log(user.name);
    const words = ["kill", "shoot", "murder", "rape", "cut", "bleed"];
    let result = false;
    result = words.some((word) => input.includes(word));
    console.log(user.email);
    if (result) {
      console.log("result returned true in function");
      let apiKey =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IjNoZUgwNWk4MFZMNkRvZVJDeFhoIiwidmVyc2lvbiI6MSwiaWF0IjoxNzE1MjYwNzg2MzQwLCJzdWIiOiJJYThTZW9QS29KbHl2UkpOWkVYciJ9.Qe5qc9aGnFqSzZWD4IFB7MEJxbMSssuOQuJjRFTs-yY";
      const apiUrl = `https://rest.gohighlevel.com/v1/contacts/lookup?email=${user.email}`;
      let header = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      };

      const options = {
        method: "GET",
        headers: header,
      };
      let contact_id = "";
      let con;
      await fetch(apiUrl, options)
        .then((response) => {
          if (!response.ok) {
            console.log("response not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          con = data.contacts;
          contact_id = con[0]["id"];
          console.log("Con ", con);
        });
      let contactArray = [];
      for (let i = 0; i < con[0].tags.length; i++) {
        contactArray.push(con[0].tags[i]);
      }
      const putAPI = `https://rest.gohighlevel.com/v1/contacts/${contact_id}`;
      const putHeader = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      };

      let data = {
        email: user.email,
        tags: [...contactArray, "triggered"],
      };

      const newOptions = {
        method: "PUT",
        headers: putHeader,
        body: JSON.stringify(data),
      };

      await fetch(putAPI, newOptions)
        .then((response) => {
          if (!response.ok) {
            console.log("Could not make PUT request ");
          }
          return response.json();
        })
        .then((data) => {
          console.log("data in GHL ", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
    return result;
  };

  const handleSend = async (message) => {
    let response;
    try {
      if (user && user.email) {
        response = await fetch(`https://oura-backend.onrender.com/paymentinfo?email=${user.email}`)
        .then((response) => response.json())
        .then((data) => {
          // console.log("Status , , ", data?.user?.status)
          setStatus(data?.user?.status);
          if (data?.user?.status == 'closed') {
            console.log("inner status is , " ,data?.user?.status)
            // user === null && setOpenD(true);
            return data?.user?.status;
          }
        })
        .catch((error) => console.error("Error:", error));
      }
      
    } catch (error) {
      console.log(error);
    }
      user === null && localStorage.setItem("User-Input", message);
      setAlertMsg(false);
      const newMessage = {
        message: message,
        sender: "user",
        direction: "outgoing",
      };
      let result = false;
      if (user != null) {
        result = await checkWords(newMessage.message);
      }
      if (result) {
        setAlertMsg(true);
      }
      let newMessages;
      if (messages === null) {
        newMessages = [newMessage];
      } else {
        newMessages = [...messages, newMessage];
      }
      console.log(newMessages);

      setMessage(newMessages);
      processOpenAI(newMessages , response);

  };

  async function processOpenAI(chatMessages , response) {
    if (response != 'closed') {
      setIsTyping(true);
      let apiMessages = chatMessages.map((chatMessage) => {
        let role = "";
        if (chatMessage.sender === "OuraTalk") {
          role = "assistant";
        } else {
          role = "user";
        }
        return { role: role, content: chatMessage.message };
      });
  
      const apiRequestBody = [...apiMessages];
      try {
        const requestBody = {
          input: apiRequestBody,
        };
        if (user && user.email) {
          requestBody.email = user.email;
          requestBody.name = user.name;
        }
        console.log("request : ", requestBody);
        await fetch(`https://oura-backend.onrender.com/assistant/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        })
          .then((data) => {
            return data.json();
          })
          .then((data) => {
            if (data.message == "closed") {
              setStatus("closed");
              setIsTyping(false);
            } else {
              console.log("Response ", data);
              setMessage([
                ...chatMessages,
                {
                  message: data.choices[0].message.content,
                  sender: "OuraTalk",
                  direction: "incoming",
                },
              ]);
              setIsTyping(false);
              user === null && setOpenD(true);
            }
          });
      } catch (error) {
        console.log(error);
      }
    } 
    
  }

  const createContactGHL = async (contactDetails) => {
    const url = "https://rest.gohighlevel.com/v1/contacts";
    const apiKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IjNoZUgwNWk4MFZMNkRvZVJDeFhoIiwidmVyc2lvbiI6MSwiaWF0IjoxNzE1MjYwNzg2MzQwLCJzdWIiOiJJYThTZW9QS29KbHl2UkpOWkVYciJ9.Qe5qc9aGnFqSzZWD4IFB7MEJxbMSssuOQuJjRFTs-yY";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactDetails),
      });

      const data = await response.json();
      // setResponse(data);
      console.log("Contact created:", data);
    } catch (error) {
      console.error("Error posting contact:", error);
      // setResponse(null);
    }
  };
  const checkUserSubscription = async (email) => {
    try {
      // console.log(email)
      fetch(`https://oura-backend.onrender.com/api/paymentinfo?email=${email}`)
        .then((response) => response.json())
        .then((data) => {
          setSubscription(data?.user);
          setStatus(data?.user?.status);
          {
            user &&
              createContactGHL({
                name: user.name,
                email: user.email,
                tags: [
                  data?.user?.status,
                  data?.user?.productName,
                  data?.user?.startDate,
                  data?.user?.expiryDate,
                ],
              });
          }
        })
        .catch((error) => console.error("Error:", error));
    } catch (error) {
      console.log(error);
    }
  };
  const logoutHandler = () => {
    // window.open("http://localhost:8000/auth/logout", "_self");
    localStorage.removeItem("userToken");
    window.location.reload();
  };
  const handleSuccess = () => {
    console.log("In handle Session Function");
    navigate("/Success");
  }
  const handleCancel = () => {
    console.log("In handle Session Function");
    navigate("/Cancel");
  }

  const loginHandler = () => {
    navigate("/Login");
  };
  //
  const upgradeHandler = () => {
    navigate("/Upgrade");
  };
  const checkHistory = async () => {

    console.log("In check history");
    let response;
    try {
      response = await fetch(`https://oura-backend.onrender.com/api/paymentinfo?email=${user.email}`)
        .then((response) => response.json())
        .then((data) => {
          // console.log("Status , , ", data?.user?.status)
          if (data?.user?.status == 'closed') {
            setStatus(data?.user?.status);
          }
          return data?.user?.status;
        })
        .catch((error) => console.error("Error:", error));
    } catch (error) {
      console.log(error);
    }
    if (response != 'closed') {
      try {
        await fetch(
          `https://oura-backend.onrender.com/history?email=${user.email}&name=${user.name}`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("Data in checkl history func ", data.message);
            setIsHistory(data.message);
            setMessage([
              {
                message: data.message,
                sender: "OuraTalk",
                direction: "incoming",
              },
            ]);
          })
          .catch((error) => console.error("Error fetching data:", error));
      } catch (error) {
        console.log(error);
      }
    }

  };
  //
  useEffect(() => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
  
    // Check if the stripe-success parameter exists
    if (params.has('stripe-success')) {
      const stripeSuccessValue = params.get('stripe-success');
      handleSuccess(); // Replace with your success handling function

      // Remove stripe-success parameter from URL
      params.delete('stripe-success');
      url.search = params.toString();
      window.history.replaceState({}, '', url.toString());
    }
    if (params.has('stripe-cancel')) {
      const stripeCancelValue = params.get('stripe-cancel');
      handleCancel(); // Replace with your success handling function

      // Remove stripe-success parameter from URL
      params.delete('stripe-cancel');
      url.search = params.toString();
      window.history.replaceState({}, '', url.toString());
    }
    
    if (user) {
      const userInput = localStorage.getItem("User-Input");
      checkUserSubscription(user.email);
      if (userInput) {
        console.log("geting:", userInput);
        setTimeout(() => {
          handleSend(userInput);
          localStorage.removeItem("User-Input");
          console.log("deleting:", userInput);
        }, 500);
      } else {
        checkHistory();
        console.log("Called Check History");
      }
    }
  }, [user]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open1 = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const closedDialog = () => {
    setStatus("close")
  };
  const statusClose = () => {
    setStatus("closed")
  };


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <div className="dashboard-container">
      <div>
        <div style={{ display: "none" }}>
          {subscription && <PricingBox subscription={subscription} />}
        </div>
      </div>
      <div className="chat-box">
        <div
          style={{
            backgroundColor: "#f1e7db",
            display: "flex",
            justifyContent: "space-between",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
          }}
        >
          <IconButton
            sx={{ margin: "10px" }}
            onClick={handleClick}
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <MenuIcon />
          </IconButton>
          <IconButton color="inherit" edge="start">
            <Avatar
              src={OuraLogo}
              alt="AI"
              style={{ transform: "scale(1.4)", margin: "15px" }}
            />
          </IconButton>
        </div>
        {/* </Toolbar> */}
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open1}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {user ? (
            <MenuList>
              <MenuItem sx={{ py: 2 }}>
                <Avatar src={user.picture} alt="profile" />
              </MenuItem>
              <MenuItem
                className="beauty"
                sx={{ py: 2 }}
              >{`Hello ${user.name}`}</MenuItem>
              {/* <MenuItem sx={{ py: 2 }}>
                <PersonIcon fontSize="small" />
                &nbsp;&nbsp;Profile
              </MenuItem> */}
              <MenuItem onClick={upgradeHandler}>
                <BoltIcon fontSize="small" />
                &nbsp;&nbsp;Current Plan:
              </MenuItem>
              <MenuItem onClick={upgradeHandler}>
                <b className={"beauty"}>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {subscription?.productName}
                </b>
              </MenuItem>
                  <MenuItem sx={{ py: 2 }} onClick={() => window.open('https://directory.ouratalk.com', '_blank', 'noopener,noreferrer')}>
    <OpenInNewIcon fontSize="small" />
    &nbsp;&nbsp; Find A Therapist Near You
  </MenuItem>
              <MenuItem sx={{ py: 2 }} onClick={logoutHandler}>
                <LogoutIcon fontSize="small" />
                &nbsp;&nbsp; Logout
              </MenuItem>
            </MenuList>
          ) : (
            <MenuItem sx={{ py: 2 }} onClick={loginHandler}>
              <LogoutIcon fontSize="small" />
              &nbsp;&nbsp; Login/Sign up
            </MenuItem>
          )}
          <MenuItem sx={{ py: 2 }} onClick={() => window.location.reload()}>
            <DeleteForeverIcon fontSize="small" />
            &nbsp;&nbsp; Clear Chat
          </MenuItem>
        </Menu>

        {/* //////////////////////////////////////////////////////////////////Dashboard */}
        <MainContainer
          id="main_c"
          style={{
            border: "1px solid white",
            borderBottomLeftRadius: "20px",
            borderBottomRightRadius: "20px",
            // overflow: "hidden",
          }}
        >
          <div className="whole">
            {alertMsg && (
              <div className="whole-text">
                Hey I’m a little worried {user.name}. <br></br> My developers
                and I deeply care and always want to ensure we side with safety
                and caution. So here is a crisis line if you need it
                <br></br>Text: Text <span className="alert-beauty">988</span> to{" "}
                <span className="alert-beauty">741741 </span>
                0r call <span className="alert-beauty">988. </span> <br></br>
                And please excuse me if I misunderstood anything, as I only want
                to help. I'm even having my team check in to see if I misspoke..
              </div>
            )}
            <ChatContainer className="container-div">
              <MessageList
                typingIndicator={
                  isTyping ? (
                    <TypingIndicator content="OURA-AI is typing" />
                  ) : null
                }
              >
                {user &&
                  messages &&
                  messages.map((message, i) => {
                    return <Message key={i} model={message} className="messageBubble" />;//////////////////////////////////////////////////
                  })}
                <div
                  className="inside-picture"
                  style={
                    user === null
                      ? {
                        margin: "0 auto",
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        marginTop: "10px",
                        width: "100%",
                        height: "60vh",
                      }
                      : {}
                  }
                >
                  {/* Content inside the div */}
                </div>
              </MessageList>
              {status === "active" || user === null ? (
                <MessageInput
                  placeholder="Type message here"
                  onSend={handleSend}
                />
              ) : (
                <MessageInput
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.5)", }}
                  placeholder={`Type message here`}
                  onSend={statusClose}
                />
              )}
            </ChatContainer>
          </div>
        </MainContainer>
        <Dialog
          open={status == 'closed'}
          // onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Update Subscription "}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              To proceed with Oura Talk services, we kindly ask you to update your Subscription.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closedDialog} autoFocus>
              Close Dialog
            </Button>
            <Button onClick={upgradeHandler} autoFocus>
              Update
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openD}
          // onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Login / Sign up "}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              To proceed with Oura Talk services, we kindly ask you to log in
              for personalized assistance and seamless Talk.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={loginHandler} autoFocus>
              Login
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;
