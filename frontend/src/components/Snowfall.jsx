import React, { useEffect, useState } from "react";

const Snowfall = () => {
  const [flakes, setFlakes] = useState([]);

  useEffect(() => {
    const flakeCount = 50; // number of snowflakes
    const tempFlakes = [];
    for (let i = 0; i < flakeCount; i++) {
      tempFlakes.push({
        id: i,
        left: Math.random() * 100, // % from left
        size: 5 + Math.random() * 10, // px
        duration: 5 + Math.random() * 10, // seconds
      });
    }
    setFlakes(tempFlakes);
  }, []);

  return (
    <div id="snow">
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="flake"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            animationDuration: `${flake.duration}s`,
          }}
        ></div>
      ))}
    </div>
  );
};

export default Snowfall;
