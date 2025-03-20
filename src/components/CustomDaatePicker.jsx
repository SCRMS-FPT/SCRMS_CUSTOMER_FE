import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from "react-icons/fa";

const CustomDatePicker = ({ selectedDate, onDateChange }) => {
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate ? new Date(selectedDate) : new Date()
  );
  const [animationDirection, setAnimationDirection] = useState(null);
  
  // Ensure current month reflects selectedDate when it changes
  useEffect(() => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      if (newDate.getMonth() !== currentMonth.getMonth() || 
          newDate.getFullYear() !== currentMonth.getFullYear()) {
        setCurrentMonth(newDate);
      }
    }
  }, [selectedDate]);
  
  // Helper functions
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getMonthName = (date) => date.toLocaleString('default', { month: 'short' });
  
  // Month navigation
  const changeMonth = (delta) => {
    setAnimationDirection(delta > 0 ? 'left' : 'right');
    setTimeout(() => {
      const newMonth = new Date(currentMonth);
      newMonth.setMonth(newMonth.getMonth() + delta);
      setCurrentMonth(newMonth);
      setAnimationDirection(null);
    }, 10);
  };
  
  // Go to today
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
  };
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();
    
    const days = [];
    
    // Add empty cells for days of previous month
    for (let i = 0; i < firstDay; i++) days.push(null);
    
    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    
    // Fill in remaining cells
    const totalCells = Math.ceil(days.length / 7) * 7;
    for (let i = days.length; i < totalCells; i++) days.push(null);
    
    return days;
  };
  
  // Date checks
  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  const isSelectedDate = (date) => {
    if (!selectedDate || !date) return false;
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };
  
  const isPastDate = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };
  
  // Handle date selection
  const handleDateSelect = (date) => {
    if (date && !isPastDate(date)) {
      onDateChange(new Date(date));
    }
  };
  
  const calendarDays = generateCalendarDays();
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  
  // Animation classes
  const getAnimationClass = () => {
    if (!animationDirection) return "";
    return animationDirection === 'left' ? "animate-slide-left" : "animate-slide-right";
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden max-w-xs">
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-blue-50 border-b">
        <button onClick={() => changeMonth(-1)} className="p-1 text-blue-600 hover:bg-white rounded-full">
          <FaChevronLeft size={14} />
        </button>
        
        <div className="flex items-center text-sm font-medium" onClick={goToToday}>
          <span>{getMonthName(currentMonth)} {currentMonth.getFullYear()}</span>
          <FaCalendarAlt className="ml-1 text-blue-500 text-xs" />
        </div>
        
        <button onClick={() => changeMonth(1)} className="p-1 text-blue-600 hover:bg-white rounded-full">
          <FaChevronRight size={14} />
        </button>
      </div>
      
      {/* Calendar */}
      <div className={`p-1 ${getAnimationClass()}`}>
        {/* Days header */}
        <div className="grid grid-cols-7 gap-1">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center text-xs text-gray-500 py-1">
              {day}
            </div>
          ))}
        </div>
        
        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => (
            <div key={index} className="aspect-square p-1">
              {date && (
                <button
                  onClick={() => handleDateSelect(date)}
                  disabled={isPastDate(date)}
                  className={`
                    w-full h-full flex items-center justify-center rounded-full text-xs
                    ${isPastDate(date) 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : isSelectedDate(date)
                        ? 'bg-blue-600 text-white'
                        : isToday(date)
                          ? 'border border-blue-500 text-blue-600'
                          : 'hover:bg-blue-50'
                    }
                  `}
                >
                  {date.getDate()}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <div className="border-t border-gray-100 p-1 flex justify-between items-center bg-gray-50 text-xs">
        <button 
          onClick={goToToday}
          className="text-blue-600 px-2 py-1 rounded hover:bg-blue-50"
        >
          Today
        </button>
        {selectedDate && (
          <span className="text-gray-500">
            {selectedDate.toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default CustomDatePicker;