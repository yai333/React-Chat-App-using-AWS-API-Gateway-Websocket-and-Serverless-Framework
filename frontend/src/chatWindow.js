import React, { useEffect, useState } from "react";
import { Launcher } from "react-chat-window";
import Sockette from "sockette";
let ws = null;

const ChatWindow = props => {
  const [messageList, setMessageList] = useState([]);
  const [badge, setBadge] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { username } = props.authData;

  useEffect(
    () => {
      if (props.authData)
        ws = new Sockette(
          "wss://APP_CLIENT_ID.execute-api.ap-southeast-2.amazonaws.com/dev?token=" +
            props.authData.signInUserSession.accessToken.jwtToken,
          {
            timeout: 5e3,
            maxAttempts: 1,
            onopen: e => console.log("connected:", e),
            onmessage: e => onMessageReceied(e),
            onreconnect: e => console.log("Reconnecting...", e),
            onmaximum: e => console.log("Stop Attempting!", e),
            onclose: e => console.log("Closed!", e),
            onerror: e => console.log("Error:", e)
          }
        );
      return function cleanup() {
        ws && ws.close();
        ws = null;
      };
    },
    [messageList]
  );

  const handleClick = () => {
    setIsOpen(!isOpen);
    setBadge(0);
  };

  const onMessageWasSent = message => {
    const newMessage = { ...message, author: username };
    ws.json({
      action: "sendMessage",
      data: JSON.stringify(newMessage)
    });
  };

  const onMessageReceied = ({ data }) => {
    const { author, type, data: messageData } = JSON.parse(data);
    const isMe = username === author ? "me" : "them";
    if (!isOpen) {
      setBadge(+badge + 1);
    }
    setMessageList([
      ...messageList,
      {
        author: isMe,
        type,
        data: messageData
      }
    ]);
  };
  return (
    <div>
      <Launcher
        agentProfile={{
          teamName: "react-live-chat",
          imageUrl:
            "https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png"
        }}
        onMessageWasSent={onMessageWasSent}
        messageList={messageList}
        handleClick={handleClick}
        isOpen={isOpen}
        showEmoji
        newMessagesCount={badge}
      />
    </div>
  );
};

export default ChatWindow;
