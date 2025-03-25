// /src/pages/NewChatView.jsx
import React, { useState } from "react";
import NewChatModal from "@/components/Chat/NewChatModal";

const NewChatView = () => {
  const [visible, setVisible] = useState(true);
  const handleClose = () => setVisible(false);

  return (
    <div className="max-w-xl mx-auto p-4">
      <NewChatModal visible={visible} onClose={handleClose} />
    </div>
  );
};

export default NewChatView;
