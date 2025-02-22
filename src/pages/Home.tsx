
import { ButtonGlow } from "@/components/ui/button-glow";
import { TextGradient } from "@/components/ui/text-gradient";
import { useNavigate } from "react-router-dom";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <HeroGeometric
        badge="Bedtime Stories"
        title1="Sweet Dreams &"
        title2="Magical Adventures"
      >
        <div className="mt-12 space-y-6 text-center">
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Journey into a world of enchanting bedtime stories where dreams come alive
            and imagination knows no bounds.
          </p>
          <ButtonGlow onClick={() => navigate("/choice")}>
            Get Started
          </ButtonGlow>
        </div>
      </HeroGeometric>
    </div>
  );
};

export default Home;
