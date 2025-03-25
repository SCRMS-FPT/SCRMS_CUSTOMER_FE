/**
 * Formats a date object into a readable string
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string (e.g., "Monday, March 20, 2025")
 */
const formatDate = (date) => {
    if (!date || !(date instanceof Date)) {
      return '';
    }
    
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  export default formatDate;