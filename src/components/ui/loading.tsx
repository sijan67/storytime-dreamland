
import { motion } from "framer-motion";
import { HeroGeometric } from "./shape-landing-hero";
import { Loader2 } from "lucide-react";

export const Loading = () => {
  return (
    <div className="min-h-screen">
      <HeroGeometric
        badge="Loading"
        title1="Just a moment"
        title2="Please wait"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-12 w-full max-w-md mx-auto space-y-8 px-4 text-center"
        >
          <div className="relative w-24 h-24 mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Loader2 className="w-12 h-12 text-white" />
            </motion.div>
          </div>

          <div className="space-y-3">
            <motion.p 
              className="text-lg text-white/90"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Preparing your experience...
            </motion.p>
            <p className="text-sm text-white/60">
              This will only take a moment
            </p>
          </div>
        </motion.div>
      </HeroGeometric>
    </div>
  );
};
