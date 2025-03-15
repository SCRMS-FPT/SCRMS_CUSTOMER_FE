import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

const ChatComponent = () => {
  const [connection, setConnection] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("/chatHub", {
        accessTokenFactory: () =>
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJmNDM0MWEwNS01OWNhLTRiMTktODc2MC00ODczZjdhYWViNjIiLCJzdWIiOiJmNDM0MWEwNS01OWNhLTRiMTktODc2MC00ODczZjdhYWViNjIiLCJlbWFpbCI6InVzZXIxQGV4YW1wbGUuY29tIiwianRpIjoiMzMxYmRjYjctNTRiZi00YzEzLTg0MDMtMzEwZTVhNWIzZmU2Iiwicm9sZSI6WyJDb3VydE93bmVyIiwiQ29hY2giXSwibmJmIjoxNzQxMDQ2NzU0LCJleHAiOjE3NDM5MjY3NTQsImlhdCI6MTc0MTA0Njc1NCwiaXNzIjoiaWRlbnRpdHktc2VydmljZSIsImF1ZCI6IndlYmFwcCJ9.2zQGpZEWZSvMQL5_lgWMR3LEJ9C_Po-jKo3CPZQAtiU",
      })
      .build();
    window.connection = newConnection;
    // Đăng ký sự kiện nhận tin nhắn
    newConnection.on("ReceiveMessage", (user, message) => {
      const msg = document.createElement("div");
      msg.textContent = `User: ${user}, Message: ${message}`;
      document.getElementById("messages").appendChild(msg);
    });

    newConnection
      .start()
      .then(() => {
        console.log("Connected to ChatHub!");
        setConnection(newConnection);
      })
      .catch((err) => console.error(err));

    return () => {
      newConnection.stop();
    };
  }, []);

  // Hàm gửi tin nhắn
  const sendMessage = async () => {
    if (connection) {
      await connection.invoke("SendMessage", "TestUser", message);
      setMessage(""); // Xóa input sau khi gửi
    }
  };

  return (
    <div>
      <div id="messages"></div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatComponent;
