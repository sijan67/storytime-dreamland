
import { cn } from "@/lib/utils";

interface TextGradientProps {
  children: React.ReactNode;
  className?: string;
}

export const TextGradient = ({ children, className }: TextGradientProps) => {
  return (
    <span
      className={cn(
        "bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-purple-300 to-yellow-200",
        className
      )}
    >
      {children}
    </span>
  );
};
