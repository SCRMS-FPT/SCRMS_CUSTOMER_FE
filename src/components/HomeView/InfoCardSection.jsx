import React from "react";
import { Card, CardContent } from "@mui/material";

const InfoCardSection = ({ title, cards }) => {
  return (
    <section className="p-6">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="flex space-x-4 overflow-x-auto">
        {cards.map((card) => (
          <Card key={card} className="w-48 border rounded-lg">
            <CardContent>
              <h3 className="text-lg font-medium">{card}</h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default InfoCardSection;
