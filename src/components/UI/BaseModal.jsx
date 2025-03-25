// /src/components/UI/BaseModal.jsx
import React from "react";
import { Modal } from "antd";

const BaseModal = ({ children, ...props }) => {
  return (
    <Modal {...props}>
      {children}
    </Modal>
  );
};

export default BaseModal;
