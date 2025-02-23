
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { ButtonGlow } from "@/components/ui/button-glow";
import { Wand2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CreateLoading = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <div className="absolute top-4 left-4 z-20">
        <ButtonGlow onClick={() => navigate("/dashboard")} size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </ButtonGlow>
      </div>

      <HeroGeometric
        badge="Creating Magic"
        title1="Crafting Your"
        title2="Story"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-12 w-full max-w-md mx-auto space-y-8 px-4 text-center"
        >
          <div className="relative w-24 h-24 mx-auto">
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/40 to-blue-500/40"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Wand2 className="w-12 h-12 text-white" />
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
              Weaving magical elements into your story...
            </motion.p>
            <p className="text-sm text-white/60">
              This may take a moment as we craft something special
            </p>
          </div>
        </motion.div>
      </HeroGeometric>
    </div>
  );
};

export default CreateLoading;
