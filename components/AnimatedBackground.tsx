"use client";

import { useEffect, useState } from "react";

interface BlobShape {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  hue: number;
  blur: number;
  opacity: number;
}

export default function AnimatedBackground() {
  const [blobs, setBlobs] = useState<BlobShape[]>([]);

  useEffect(() => {
    const arr: BlobShape[] = [];
    const count = 10;

    const vw = window.innerWidth;
    const vh = window.innerHeight * 2;

    for (let i = 0; i < count; i++) {
      arr.push({
        id: i,
        size: Math.random() * 400 + 120,
        x: Math.random() * vw,
        y: Math.random() * vh,
        duration: Math.random() * 20 + 35,
        delay: Math.random() * 5,
        hue: Math.random() * 360,
        blur: Math.random() * 40 + 20,
        opacity: 0.25 + Math.random() * 0.25,
      });
    }

    setBlobs(arr);
  }, []);

  return (
    <div
      className="absolute inset-0 -z-50 pointer-events-none"
      style={{ height: "250vh" }}
    >
      {blobs.map((b) => (
        <div
          key={b.id}
          className="absolute will-change-transform"
          style={{
            left: b.x,
            top: b.y,
            width: b.size,
            height: b.size,
            borderRadius: "50%",
            background: `radial-gradient(circle at 30% 30%, hsl(${b.hue} 80% 70%), hsl(${b.hue} 80% 60%))`,
            filter: `blur(${b.blur}px)`,
            opacity: b.opacity,
            animation: `blobFloat ${b.duration}s ease-in-out ${b.delay}s infinite`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes blobFloat {
          0% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(40px, -60px) scale(1.05);
          }
          100% {
            transform: translate(0, 0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
