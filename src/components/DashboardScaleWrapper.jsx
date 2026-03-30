import { useEffect, useState } from "react";
 
const DESIGN_WIDTH = 1440;
const DESIGN_HEIGHT = 900;
 
export default function DashboardScaleWrapper({ children }) {
  const [scale, setScale] = useState(1);
 
  useEffect(() => {
    const updateScale = () => {
      const scaleX = window.innerWidth / DESIGN_WIDTH;
      const scaleY = window.innerHeight / DESIGN_HEIGHT;
 
      setScale(Math.min(scaleX, scaleY));
    };
 
    updateScale();
    window.addEventListener("resize", updateScale);
 
    return () => window.removeEventListener("resize", updateScale);
  }, []);
 
  return (
<div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#f4f6fb",
      }}
>
<div
        style={{
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
 
          // 🔥 CENTER + SCALE FIX
          transform: `scale(${scale})`,
          transformOrigin: "top left",
 
          // 🔥 THIS IS THE REAL FIX
          margin: "0 auto",
        }}
>
        {children}
</div>
</div>
  );
}