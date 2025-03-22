import React, { useEffect, useState } from "react";
import Dashboard from "../components/dashboard";
function ChatPage(props) {
  return (
    <>
      <Dashboard user={props.user} />
    </>
  );
}

export default ChatPage;
