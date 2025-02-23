
import { ButtonGlow } from "@/components/ui/button-glow";
import { TextGradient } from "@/components/ui/text-gradient";
import { useNavigate } from "react-router-dom";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { useState } from "react";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, signOut } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate("/choice");
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="absolute top-4 right-4 z-20">
        {user ? (
          <ButtonGlow onClick={signOut}>Sign Out</ButtonGlow>
        ) : (
          <ButtonGlow onClick={() => setShowAuthModal(true)}>Sign In</ButtonGlow>
        )}
      </div>

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
          <ButtonGlow onClick={handleGetStarted}>
            Get Started
          </ButtonGlow>
        </div>
      </HeroGeometric>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default Home;
