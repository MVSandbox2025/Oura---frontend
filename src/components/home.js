import React from "react";
import ChatPage from "../pages/ChatPage";

function Home(props) {

  return (
    <div className="home">
      <ChatPage user={props.user} />
    </div>
  );
}

export default Home;
