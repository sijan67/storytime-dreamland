
import { motion } from "framer-motion";
import { Book, Wand2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { ButtonGlow } from "@/components/ui/button-glow";

const ChoiceButton = ({ icon: Icon, text, onClick }: {
  icon: typeof Book | typeof Wand2;
  text: string;
  onClick: () => void;
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] transition-colors w-full max-w-[280px] group"
  >
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
      <Icon className="w-12 h-12 text-white relative z-10" />
    </div>
    <span className="text-xl text-white font-medium tracking-wide relative z-10">
      {text}
    </span>
  </motion.button>
);

const Choice = () => {
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
        badge="Choose Your Adventure"
        title1="What Would You"
        title2="Like to Do?"
      >
        <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8 max-w-3xl mx-auto px-4">
          <ChoiceButton
            icon={Wand2}
            text="Create a Story"
            onClick={() => navigate("/create")}
          />
          <ChoiceButton
            icon={Book}
            text="Read a Story"
            onClick={() => navigate("/read")}
          />
        </div>
      </HeroGeometric>
    </div>
  );
};

export default Choice;
