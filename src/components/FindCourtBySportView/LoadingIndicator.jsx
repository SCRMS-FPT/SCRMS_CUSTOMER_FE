import React from "react";

const LoadingIndicator = () => {
  return (
    <div className="flex justify-center mb-8 fade-in">
      <i className="fas fa-spinner fa-spin text-3xl text-indigo-600"></i>
    </div>
  );
};

export default LoadingIndicator;