import React from "react";
import { Form, Button } from "antd";

const VenueFormActions = ({ form }) => {
  return (
    <div className="flex justify-end space-x-4 mt-4">
      <Button onClick={() => form.resetFields()}>Cancel</Button>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </div>
  );
};

export default VenueFormActions;
