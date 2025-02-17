import React, { useState, useRef } from "react";
import { FaBell } from "react-icons/fa";

const Notification = ({
  notifications = [
    {
      content: "Đã đặt thành công sân ở Hà Nội",
      date: "17/02/2025",
    },
    {
      content: "Đã đặt thành công sân ở Hòa Bình",
      date: "18/02/2025",
    },
  ],
}) => {
  const [open, setOpen] = useState(false);
  const [alignLeft, setAlignLeft] = useState(false);
  const containerRef = useRef(null);

  const toggleDropdown = () => {
    setOpen((prev) => {
      const newOpen = !prev;
      if (newOpen && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setAlignLeft(rect.left < 150);
      }
      return newOpen;
    });
  };

  const handleViewAll = () => {
    console.log("Xem tất cả clicked");
  };

  const handleReadAll = () => {
    console.log("Đã đọc hết clicked");
  };

  const containerStyle = {
    position: "relative",
    display: "inline-block",
  };

  const bellStyle = {
    cursor: "pointer",
    position: "relative",
  };

  const badgeStyle = {
    position: "absolute",
    top: "-0.3em",
    right: "-0.3em",
    backgroundColor: "red",
    color: "white",
    borderRadius: "50%",
    padding: "0.1em 0.3em",
    fontSize: "0.8rem",
  };

  const dropdownStyle = {
    position: "absolute",
    top: "2rem",
    width: "90vw",
    maxWidth: "22rem",
    maxHeight: "50vh",
    overflowY: "auto",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "0.4rem",
    boxShadow: "0 0.2rem 0.8rem rgba(0, 0, 0, 0.15)",
    transition: "all 0.3s ease",
    transform: open ? "translateY(0)" : "translateY(-0.5rem)",
    opacity: open ? 1 : 0,
    pointerEvents: open ? "auto" : "none",
    zIndex: 1000,
    ...(alignLeft ? { left: 0 } : { right: 0 }),
  };

  const notificationItemStyle = {
    padding: "0.8em",
    borderBottom: "1px solid #eee",
    display: "flex",
    flexDirection: "column",
  };

  const footerStyle = {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.8em",
    borderTop: "1px solid #eee",
  };

  const buttonStyle = {
    background: "none",
    border: "none",
    color: "#007bff",
    cursor: "pointer",
    fontSize: "0.9rem",
  };

  const dateStyle = {
    fontSize: "0.85rem",
    color: "#777",
    marginTop: "0.3em",
    textAlign: "right",
  };

  const displayNotifications = notifications.slice(0, 5);

  const bellIcon = <FaBell size="1.5rem" color="black" />;

  return (
    <div style={containerStyle} ref={containerRef}>
      {/* Bell Icon & Notification Badge */}
      <div style={bellStyle} onClick={toggleDropdown}>
        {bellIcon}
        {notifications.length > 0 && (
          <span style={badgeStyle}>{notifications.length}</span>
        )}
      </div>

      {/* Dropdown */}
      <div style={dropdownStyle}>
        {notifications.length > 0 ? (
          <>
            {displayNotifications.map((notification, index) => (
              <div key={index} style={notificationItemStyle}>
                <span>{notification.content}</span>
                <span style={dateStyle}>{notification.date}</span>
              </div>
            ))}
            <div style={footerStyle}>
              {notifications.length > 5 && (
                <button style={buttonStyle} onClick={handleViewAll}>
                  Xem tất cả
                </button>
              )}
              <button style={buttonStyle} onClick={handleReadAll}>
                Đã đọc hết
              </button>
            </div>
          </>
        ) : (
          <div style={notificationItemStyle}>Không có thông báo nào cả</div>
        )}
      </div>
    </div>
  );
};

export default Notification;
