import { useEffect, useState } from "react";
import { sendMsg, syncData } from "../Firebase";
import "./Chat.css";

/* Component of individual msg */
function MSG(props) {
  // Style obj base on my message or others
  const border = {
    borderColor: props.mine ? "blue" : "gray",
    textAlign: props.mine ? "" : "right"
  };

  return (<div className="d-flex m-1">
    { // Add spacing if message is not mine
      !props.mine && <div className="flex-grow-1"> </div> }

    <div className="msg" style={border}>
      {props.msg}
    </div>
  </div>);
}


/* Chat componet */
function Chat(props) {
  // React hook, to store all messages
  const [msg, setMsg] = useState(null);

  // React hook, to sync all messages
  useEffect(() => syncData(props.path, setMsg), []);
  
  return(
    <div id="chat-container" className="position-fixed end-0 bottom-0">
      <div id="chats">
        {msg?.map((mesage,index) => {
          return( <MSG key={index} mine={mesage[0]===props.login} msg={mesage[1]} /> );
        })}
      </div>

      <div id="input-section" className="d-flex">
        <input
          type="text"
          className="d-inline form-control mx-2"
          spellCheck="false" />

        <button className="btn btn-primary mx-2" onClick={e => {
          const ele = document.querySelector('#input-section input');
          const val = ele.value;
          ele.value = "";
          
          sendMsg(props.path, msg, [props.login, val]); }}>
        <i class="bi bi-cursor-fill"></i>
        </button>
      </div>
    </div>
  );
}

export default Chat;