
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileText, Edit, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const StarShape = ({
  className,
  delay = 0,
  size = 4,
  rotate = 0,
  color = "text-yellow-300",
}: {
  className?: string;
  delay?: number;
  size?: number;
  rotate?: number;
  color?: string;
}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -50,
        rotate: rotate - 15,
        scale: 1,
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
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="relative"
      >
        <Star className={cn("w-full h-full", color)} size={size} fill="currentColor" />
      </motion.div>
    </motion.div>
  );
};

const Dashboard = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const stories = [
    { title: "The Rabbit and the Turtle", id: 1 },
    { title: "Adventure of Dragon", id: 2 },
    { title: "Little Red Robinhood", id: 3 },
  ];

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-transparent to-purple-900/30 blur-3xl" />
      
      <div className="absolute inset-0">
        <StarShape delay={0.2} size={5} rotate={12} color="text-yellow-200" className="left-[10%] top-[15%]" />
        <StarShape delay={0.3} size={4} rotate={-15} color="text-yellow-100" className="right-[15%] top-[25%]" />
        <StarShape delay={0.4} size={4.5} rotate={8} color="text-yellow-300" className="left-[20%] bottom-[20%]" />
        <StarShape delay={0.5} size={3.5} rotate={20} color="text-yellow-200" className="right-[25%] top-[40%]" />
        <StarShape delay={0.6} size={4} rotate={-12} color="text-yellow-100" className="left-[30%] top-[60%]" />
        <StarShape delay={0.7} size={4.5} rotate={15} color="text-yellow-200" className="right-[35%] bottom-[30%]" />
        <StarShape delay={0.8} size={3.5} rotate={-20} color="text-yellow-300" className="left-[40%] top-[35%]" />
        <StarShape delay={0.9} size={4} rotate={25} color="text-yellow-100" className="right-[40%] top-[55%]" />
        <StarShape delay={1.0} size={3} rotate={30} color="text-yellow-200" className="left-[45%] bottom-[40%]" />
        <StarShape delay={1.1} size={3.5} rotate={-8} color="text-yellow-100" className="right-[48%] top-[20%]" />
        <StarShape delay={1.2} size={4} rotate={22} color="text-yellow-300" className="left-[52%] top-[45%]" />
        <StarShape delay={1.3} size={3} rotate={-25} color="text-yellow-200" className="right-[55%] bottom-[25%]" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1F2C] via-transparent to-[#1A1F2C]/80 pointer-events-none" />

      <Tabs defaultValue="your-stories" orientation="vertical" className="flex w-full min-h-screen relative z-10">
        <TabsList className="flex-col h-screen bg-black/20 p-4 space-y-4">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="your-stories" className="py-3">
                  <FileText size={16} strokeWidth={2} />
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="right" className="px-2 py-1 text-xs">
                Your Stories
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="create" className="py-3" onClick={() => navigate("/create")}>
                  <Edit size={16} strokeWidth={2} />
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="right" className="px-2 py-1 text-xs">
                Create New Story
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="sign-out" className="py-3 mt-auto" onClick={signOut}>
                  <LogOut size={16} strokeWidth={2} />
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="right" className="px-2 py-1 text-xs">
                Sign Out
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TabsList>

        <div className="grow p-8">
          <TabsContent value="your-stories" className="m-0">
            <h2 className="text-2xl font-bold mb-6">Your Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="p-6 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer"
                  onClick={() => navigate(`/story/${story.id}`)}
                >
                  <h3 className="text-lg font-medium">{story.title}</h3>
                </div>
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Dashboard;
