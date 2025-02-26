import React from "react";

const MonthDayCard = ({ count }) => {
    return (
        <div className="absolute bottom-2 left-2 right-2 bg-blue-500 text-white text-xs text-center rounded py-1">
            {count} {count > 1 ? "Events" : "Event"}
        </div>
    );
};

export default MonthDayCard;
