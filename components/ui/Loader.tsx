"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";

interface LoaderProps {
  fullScreen?: boolean;
  solidBackground?: boolean;
  text?: string;
}

export function Loader({ fullScreen = false, solidBackground = false, text = "" }: LoaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative flex items-center justify-center w-24 h-24">
        {/* Outer spinning gradient ring */}
        <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-blue-500 animate-[spin_1.5s_linear_infinite]" />
        
        {/* Inner reverse spinning ring */}
        <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-cyan-400 animate-[spin_2s_linear_infinite_reverse]" />
        
        {/* Center Logo */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
           <Image
             src="/images/logo1.png"
             alt="Loading..."
             width={60}
             height={30}
             className="object-contain animate-pulse"
           />
        </div>
      </div>
      
      {text && (
        <p className="text-sm font-medium text-blue-400/80 animate-pulse tracking-widest uppercase">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={`fixed inset-0 z-[9999] flex items-center justify-center ${solidBackground ? "bg-background" : "bg-background/80 backdrop-blur-md"}`}>
        {content}
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center">
      {content}
    </div>
  );
}
