import { API_GATEWAY_URL } from "@/API/config";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

export class SignalRService {
  constructor() {
    this.connection = null;
  }

  startConnection = async (accessToken) => {
    try {
      this.connection = new HubConnectionBuilder()
        .withUrl("http://localhost:6006/notifyHub", {
          accessTokenFactory: () => accessToken,
          withCredentials: true,
        })
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build();

      // Start the connection
      await this.connection.start();
      console.log("SignalR Connected");

      // Handle reconnection events
      this.connection.onreconnecting((error) => {
        console.warn("SignalR Reconnecting:", error);
      });

      this.connection.onreconnected((connectionId) => {
        console.log("SignalR Reconnected:", connectionId);
      });

      this.connection.onclose((error) => {
        console.error("SignalR Disconnected:", error);
      });
    } catch (err) {
      console.error("SignalR Connection Error:", err);
    }
  };

  // Register a handler for receiving notifications
  onReceiveNotification = (callback) => {
    if (this.connection) {
      this.connection.on("ReceiveNotification", (notification) => {
        callback(notification);
      });
    }
  };

  // Stop the connection
  stopConnection = async () => {
    if (this.connection) {
      await this.connection.stop();
      console.log("SignalR Disconnected");
    }
  };
}
