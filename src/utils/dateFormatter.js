// /src/utils/dateFormatter.js
export const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  