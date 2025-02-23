
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { ButtonGlow } from "@/components/ui/button-glow";
import { ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const navigate = useNavigate();
  const [voice, setVoice] = useState("");
  const [language, setLanguage] = useState("");
  const [context, setContext] = useState("");

  const handleSubmit = () => {
    navigate("/create/loading");
  };

  return (
    <div className="min-h-screen">
      <div className="absolute top-4 left-4 z-20">
        <ButtonGlow 
          onClick={() => navigate("/dashboard")} 
          className="px-4 py-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </ButtonGlow>
      </div>
      
      <HeroGeometric
        badge="Story Creation"
        title1="Create Your"
        title2="Magical Story"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-12 w-full max-w-md mx-auto space-y-6 px-4"
        >
          <Select value={voice} onValueChange={setVoice}>
            <SelectTrigger className="w-full bg-white/[0.02] border-white/5 text-white/90 hover:bg-white/[0.04] transition-colors">
              <SelectValue placeholder="Choose a Voice" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="parent">Parent's Voice</SelectItem>
              <SelectItem value="wizard">Wizard Voice</SelectItem>
              <SelectItem value="fairy">Fairy Voice</SelectItem>
              <SelectItem value="dragon">Dragon Voice</SelectItem>
            </SelectContent>
          </Select>

          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full bg-white/[0.02] border-white/5 text-white/90 hover:bg-white/[0.04] transition-colors">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
            </SelectContent>
          </Select>

          <Textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Describe your story... (e.g., 'A magical adventure about a brave little dragon learning to fly')"
            className="min-h-[120px] bg-white/[0.02] border-white/5 text-white/90 placeholder:text-white/40 hover:bg-white/[0.04] transition-colors"
          />

          <ButtonGlow 
            onClick={handleSubmit}
            disabled={!voice || !language || !context}
            className="w-full"
          >
            Generate Story
          </ButtonGlow>
        </motion.div>
      </HeroGeometric>
    </div>
  );
};

export default Create;
