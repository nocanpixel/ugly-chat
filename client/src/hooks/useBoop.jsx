import React, { useState } from "react";
import { useSpring } from "@react-spring/web";

export default function useBoop() {
  const [isBooped, setIsBooped] = useState(false);

  const {x} = useSpring({
    from: { x: 0 },
    x: isBooped ? 0.1 : 0,
    config: { duration: 400 },
  });

  const style = {
    boxShadow: x.to(o=> `0 10px 15px -3px rgb(0 0 0 / ${o}), 0 4px 6px -4px rgb(0 0 0 / ${o})`)
  }

  const trigger = () => {
    setIsBooped(!isBooped);
  };

  return {
    style,
    trigger
  }
}