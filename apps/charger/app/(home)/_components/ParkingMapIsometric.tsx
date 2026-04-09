"use client";

import { useEffect, useRef } from "react";
import { cn } from "../../../lib/utils";

interface ParkingMapIsometricProps {
  floor: string;
}

export const ParkingMapIsometric = ({ floor }: ParkingMapIsometricProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle High DPI displays
    const dpr = window.devicePixelRatio || 1;
    const size = 320;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    // Projection Constants
    // Zoomed in version focusing on SE corner (Pillar 14 and Parking slots)
    const centerX = size / 2 - 60; // Shifted left to bring SE corner more into center
    const centerY = size / 2; // Shifted up to bring SE corner more into center
    const scale = 3.6; // Doubled scale from 1.8 to 3.6
    const angleZ = 15 * Math.PI / 180;
    const angleX = 65 * Math.PI / 180;

    const project = (x: number, y: number, z: number) => {
      // 1. Rotate Z (Ground Rotation)
      const rx = x * Math.cos(angleZ) - y * Math.sin(angleZ);
      const ry = x * Math.sin(angleZ) + y * Math.cos(angleZ);
      // 2. Rotate X (Tilt)
      const sx = rx;
      const sy = ry * Math.cos(angleX) - z * Math.sin(angleX);
      return { x: centerX + sx * scale, y: centerY + sy * scale };
    };

    const draw = () => {
      ctx.clearRect(0, 0, size, size);

      // --- 1. Grid Lines (Extended) ---
      ctx.beginPath();
      ctx.strokeStyle = "rgba(96, 165, 250, 0.2)";
      ctx.lineWidth = 0.5;

      const gridSize = 32;
      const gridSpacing = 16;

      // Draw horizontal & vertical grid lines (extended 1.5x)
      for (let i = -gridSize * 1.5; i <= gridSize * 1.5; i++) {
        // X lines
        const s1 = project(i * gridSpacing, -gridSize * 1.5 * gridSpacing, 0);
        const e1 = project(i * gridSpacing, gridSize * 1.5 * gridSpacing, 0);
        ctx.moveTo(s1.x, s1.y);
        ctx.lineTo(e1.x, e1.y);

        // Y lines
        const s2 = project(-gridSize * 1.5 * gridSpacing, i * gridSpacing, 0);
        const e2 = project(gridSize * 1.5 * gridSpacing, i * gridSpacing, 0);
        ctx.moveTo(s2.x, s2.y);
        ctx.lineTo(e2.x, e2.y);
      }
      ctx.stroke();

      // --- 2. Floor Base ---
      const fSize = 64; // Floor half-size (128x128 total)
      const p1 = project(-fSize, -fSize, 0);
      const p2 = project(fSize, -fSize, 0);
      const p3 = project(fSize, fSize, 0);
      const p4 = project(-fSize, fSize, 0);

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.closePath();

      // Floor Fill
      const floorGrad = ctx.createLinearGradient(p1.x, p1.y, p3.x, p3.y);
      floorGrad.addColorStop(0, "rgba(30, 58, 138, 0.05)");
      floorGrad.addColorStop(1, "rgba(30, 58, 138, 0.15)");
      ctx.fillStyle = floorGrad;
      ctx.fill();

      // Floor Border
      ctx.strokeStyle = "rgba(59, 130, 246, 0.3)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // --- 3. Parking Slots (SE Corner) ---
      const slotW = 12;
      const slotH = 36;
      const startX = 2; // Placed in SE quadrant
      const startY = 20;

      ctx.lineWidth = 1.5;
      ctx.font = "bold 8px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let i = 0; i < 3; i++) {
        const x = startX + i * (slotW + 2);
        const y = startY;

        const s1 = project(x, y, 0);
        const s2 = project(x + slotW, y, 0);
        const s3 = project(x + slotW, y + slotH, 0);
        const s4 = project(x, y + slotH, 0);

        ctx.beginPath();
        ctx.strokeStyle = "rgba(96, 165, 250, 0.4)";
        ctx.moveTo(s4.x, s4.y);
        ctx.lineTo(s1.x, s1.y);
        ctx.lineTo(s2.x, s2.y);
        ctx.lineTo(s3.x, s3.y);
        ctx.stroke();

        // "P" Marker (compensation for rotation?)
        const mid = project(x + slotW / 2, y + slotH / 2, 0);
        ctx.fillStyle = "white";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText("P", mid.x, mid.y);
      }

      // --- 4. Pillar 14 (3D Hexahedron) ---
      const pillX = 48;
      const pillY = 24;
      const pillW = 8;
      const pillH = 8;
      const pillZ = 24;

      // Projection points for Pillar
      const bp0 = project(pillX, pillY, 0);
      const bp1 = project(pillX + pillW, pillY, 0);
      const bp2 = project(pillX + pillW, pillY + pillH, 0);
      const bp3 = project(pillX, pillY + pillH, 0);

      const tp0 = project(pillX, pillY, pillZ);
      const tp1 = project(pillX + pillW, pillY, pillZ);
      const tp2 = project(pillX + pillW, pillY + pillH, pillZ);
      const tp3 = project(pillX, pillY + pillH, pillZ);

      // Draw Faces (Painter's Algorithm: Back to Front)
      // North Face (Back)
      ctx.beginPath();
      ctx.moveTo(bp0.x, bp0.y);
      ctx.lineTo(bp1.x, bp1.y);
      ctx.lineTo(tp1.x, tp1.y);
      ctx.lineTo(tp0.x, tp0.y);
      ctx.closePath();
      ctx.fillStyle = "rgba(30, 58, 138, 0.05)";
      ctx.fill();

      // West Face (Back-ish)
      ctx.beginPath();
      ctx.moveTo(bp0.x, bp0.y);
      ctx.lineTo(bp3.x, bp3.y);
      ctx.lineTo(tp3.x, tp3.y);
      ctx.lineTo(tp0.x, tp0.y);
      ctx.closePath();
      ctx.fillStyle = "rgba(30, 58, 138, 0.05)";
      ctx.fill();

      // East Face (Right)
      ctx.beginPath();
      ctx.moveTo(bp1.x, bp1.y);
      ctx.lineTo(bp2.x, bp2.y);
      ctx.lineTo(tp2.x, tp2.y);
      ctx.lineTo(tp1.x, tp1.y);
      ctx.closePath();
      ctx.fillStyle = "rgba(59, 130, 246, 0.05)";
      ctx.fill();
      ctx.strokeStyle = "rgba(147, 197, 253, 0.5)";
      ctx.stroke();

      // South Face (Front)
      ctx.beginPath();
      ctx.moveTo(bp3.x, bp3.y);
      ctx.lineTo(bp2.x, bp2.y);
      ctx.lineTo(tp2.x, tp2.y);
      ctx.lineTo(tp3.x, tp3.y);
      ctx.closePath();
      ctx.fillStyle = "rgba(30, 58, 138, 0.15)";
      ctx.fill();
      ctx.stroke();

      // "14" Label on South Face
      const midSouthX = (bp3.x + tp2.x) / 2;
      const midSouthY = (bp3.y + tp2.y) / 2;
      ctx.fillStyle = "white";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("14", midSouthX, midSouthY);

      // Top Face (Lid)
      ctx.beginPath();
      ctx.moveTo(tp0.x, tp0.y);
      ctx.lineTo(tp1.x, tp1.y);
      ctx.lineTo(tp2.x, tp2.y);
      ctx.lineTo(tp3.x, tp3.y);
      ctx.closePath();
      ctx.fillStyle = "rgba(147, 197, 253, 0.3)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.stroke();

      // Top HUD point
      const centerTop = project(pillX + pillW / 2, pillY + pillH / 2, pillZ);
      ctx.beginPath();
      ctx.arc(centerTop.x, centerTop.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.save();
      ctx.shadowBlur = 10;
      ctx.shadowColor = "white";
      ctx.stroke();
      ctx.restore();

      // --- 5. Compass ---
      ctx.save();
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = "#6b7280";
      ctx.font = "italic 10px monospace";
      ctx.fillText("N", 20, 20);
      ctx.fillRect(20, 25, 1, 15);
      ctx.fillText("S", 20, 50);
      ctx.restore();
    };

    draw();

    // Redraw on floor change
  }, [floor]);

  return (
    <div className="relative w-full aspect-square max-w-[320px] mx-auto flex items-center justify-center p-8 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full animate-in zoom-in-95 duration-1000 ease-out"
        style={{ imageRendering: "auto" }}
      />

      {/* Floor Depth Decoration */}
      <div className="absolute bottom-10 right-10 flex flex-col items-end gap-1 opacity-20 pointer-events-none">
        <div className="w-24 h-px bg-gradient-to-l from-blue-500 to-transparent"></div>
        <span className="text-[10px] font-mono tracking-widest text-blue-400 capitalize whitespace-nowrap">parking floor visualization</span>
      </div>
    </div>
  );
};
