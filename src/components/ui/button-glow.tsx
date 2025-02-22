
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ButtonGlowProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const ButtonGlow = ({ children, className, ...props }: ButtonGlowProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium tracking-wider text-white rounded-full bg-gradient-to-r from-purple-600 to-blue-600 group hover:from-purple-700 hover:to-blue-700 transition-all duration-300",
        "before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-r before:from-purple-600 before:to-blue-600 before:blur-xl before:opacity-50 before:rounded-full before:transition-all before:duration-300",
        "hover:before:opacity-75 hover:before:blur-2xl",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};
