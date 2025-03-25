// /src/hooks/useWebSocket.js
import { useEffect, useRef } from "react";

const useWebSocket = (url, onMessage) => {
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(url);
    ws.current.onmessage = (event) => {
      if (onMessage) onMessage(JSON.parse(event.data));
    };
    return () => {
      ws.current.close();
    };
  }, [url, onMessage]);

  const sendMessage = (data) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    }
  };

  return { sendMessage };
};

export default useWebSocket;
