import { Camera } from "lucide-react";

export interface LogoProps {
  variant?: "full" | "icon";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Logo({ variant = "full", size = "md", className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  const iconSizes = {
    sm: 18,
    md: 22,
    lg: 26,
    xl: 32,
  };

  return (
    <div className={`flex items-center gap-2 font-serif font-bold ${sizeClasses[size]} ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-fotessence-main blur-sm opacity-50 rounded-full"></div>
        <Camera
          size={iconSizes[size]}
          className="relative text-white"
          strokeWidth={2.5}
        />
      </div>
      {variant === "full" && (
        <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
          Fotessence
        </span>
      )}
    </div>
  );
}