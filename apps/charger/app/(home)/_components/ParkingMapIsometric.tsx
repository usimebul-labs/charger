"use client";

import { cn } from "../../../lib/utils";

interface ParkingMapIsometricProps {
  floor: string;
}

export const ParkingMapIsometric = ({ floor }: ParkingMapIsometricProps) => {
  return (
    <div className="relative w-full aspect-square max-w-[320px] mx-auto [perspective:1000px] flex items-center justify-center p-8 overflow-hidden">
      {/* Compass / Orientation Guide (Subtle) */}
      <div className="absolute top-4 left-4 flex flex-col text-[10px] text-gray-500 font-mono italic opacity-40">
        <span>N</span>
        <div className="h-4 w-px bg-gray-700 ml-1"></div>
        <span>S</span>
      </div>

      {/* Container with Isometric Transform */}
      <div
        className="relative w-100 h-100 transition-all duration-1000 ease-out animate-in zoom-in-95 bottom-5 left-5"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateX(65deg) rotateZ(15deg)"
        }}
      >
        {/* Floor Base with Fading Edges */}
        <div
          className="absolute inset-0 bg-blue-900/10 border-2 border-blue-500/30 rounded-sm backdrop-blur-[2px] shadow-[0_0_50px_rgba(59,130,246,0.05)]"
          style={{
            transform: "translateZ(0px)",
            maskImage: "linear-gradient(to right, transparent, black 10%), linear-gradient(to bottom, transparent, black 10%)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 10%), linear-gradient(to bottom, transparent, black 10%)",
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in"
          }}
        >
          {/* Grid Lines (Extended Further) */}
          <div className="absolute inset-x-[-150%] inset-y-[-150%] w-[400%] h-[400%] grid grid-cols-[repeat(16,1fr)] grid-rows-[repeat(16,1fr)] opacity-[0.05]">
            {[...Array(256)].map((_, i) => (
              <div key={i} className="border-[0.5px] border-blue-400"></div>
            ))}
          </div>

          {/* Parking Lines (3 Distinct Slots facing North) */}
          <div className="absolute bottom-1 right-10 flex flex-row gap-1 bg-gray-900/90">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-8 h-16 border-2 border-blue-400/60 border-b-0 rounded-t-sm flex items-center justify-center">
                <span className="text-base font-black text-blue-400/50">P</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shadow Casting (to enhance 3D effect) */}
        <div className="absolute -inset-4 bg-black/20 blur-2xl rounded-full -translate-z-10 opacity-50"></div>
      </div>

      {/* Floor Depth Decoration */}
      <div className="absolute bottom-10 right-10 flex flex-col items-end gap-1 opacity-20 pointer-events-none">
        <div className="w-24 h-px bg-gradient-to-l from-blue-500 to-transparent"></div>
        <span className="text-[10px] font-mono tracking-widest text-blue-400 capitalize whitespace-nowrap">parking floor visualization</span>
      </div>
    </div >
  );
};
