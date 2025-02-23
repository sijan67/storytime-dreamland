
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ButtonGlow } from "@/components/ui/button-glow";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
      } else {
        await signUp(email, password);
        toast({
          title: "Welcome!",
          description: "Your account has been created successfully.",
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1F2C] border-white/5 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isLogin ? "Welcome Back" : "Create Account"}
          </DialogTitle>
          <DialogDescription className="text-white/70">
            {isLogin
              ? "Enter your details to sign in"
              : "Enter your details to create an account"}
          </DialogDescription>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-4 mt-4"
        >
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/[0.02] border-white/5 text-white/90 placeholder:text-white/40"
            />
          </div>

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white/[0.02] border-white/5 text-white/90 placeholder:text-white/40"
            />
          </div>

          <ButtonGlow type="submit" className="w-full" disabled={loading}>
            {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
          </ButtonGlow>

          <p className="text-center text-sm text-white/60">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-white/90 hover:text-white underline"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}
