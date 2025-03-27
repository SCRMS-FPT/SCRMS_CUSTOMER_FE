// /src/components/UI/BaseButton.jsx
import React from "react";
import { Button } from "antd";

const BaseButton = ({ children, ...props }) => {
  return (
    <Button {...props} className={`rounded ${props.className || ""}`}>
      {children}
    </Button>
  );
};

export default BaseButton;
