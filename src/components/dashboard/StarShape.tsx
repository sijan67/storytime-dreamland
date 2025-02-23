
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarShapeProps {
  className?: string;
  delay?: number;
  size?: number;
  rotate?: number;
  color?: string;
}

export const StarShape = ({
  className,
  delay = 0,
  size = 4,
  rotate = 0,
  color = "text-yellow-300",
}: StarShapeProps) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -50,
        rotate: rotate - 15,
        scale: 0.8,
      }}
      animate={{
        opacity: 0.15,
        y: 0,
        rotate: rotate,
        scale: 1,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute w-6 h-6", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
          scale: [0.9, 1, 0.9],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="relative w-full h-full"
      >
        <Star 
          className={cn("w-full h-full", color)} 
          size={size} 
          fill="currentColor"
          style={{ transform: 'scale(0.4)' }}
        />
      </motion.div>
    </motion.div>
  );
};
