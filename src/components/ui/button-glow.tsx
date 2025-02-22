
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

type ButtonGlowProps = HTMLMotionProps<"button"> & {
  children: React.ReactNode;
  className?: string;
};

export const ButtonGlow = ({ children, className, ...props }: ButtonGlowProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium tracking-wider text-white rounded-full bg-gradient-to-r from-purple-500/40 to-blue-500/40 group hover:from-purple-500/60 hover:to-blue-500/60 transition-all duration-300",
        "before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-r before:from-purple-500/20 before:to-blue-500/20 before:blur-xl before:opacity-50 before:rounded-full before:transition-all before:duration-300",
        "hover:before:opacity-75 hover:before:blur-2xl",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:before:opacity-50 disabled:hover:from-purple-500/40 disabled:hover:to-blue-500/40",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};
