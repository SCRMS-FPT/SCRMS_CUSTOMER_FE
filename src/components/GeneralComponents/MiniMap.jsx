import React, { useState, useEffect } from "react";
import { Stage, Layer, Rect, Transformer } from "react-konva";
import mockFields from "../../data/mockFields"; // Import mock data

const MiniMap = () => {
  const [fields, setFields] = useState([]);

  // Load dữ liệu từ mockData
  useEffect(() => {
    setFields(mockFields);
  }, []);

  // Thêm sân mới
  const addField = () => {
    const newField = {
      id: Date.now(),
      x: 100,
      y: 100,
      width: 120,
      height: 60,
      rotation: 0,
    };
    setFields([...fields, newField]);
  };

  return (
    <div>
      <button onClick={addField}>➕ Thêm Sân</button>
      <Stage width={800} height={600} style={{ border: "1px solid black" }}>
        <Layer>
          {fields.map((field) => (
            <Rect
              key={field.id}
              x={field.x}
              y={field.y}
              width={field.width}
              height={field.height}
              fill="green"
              draggable
              rotation={field.rotation}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default MiniMap;
