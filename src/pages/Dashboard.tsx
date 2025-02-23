
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

const Dashboard = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const stories = [
    { title: "The Rabbit and the Turtle", id: 1 },
    { title: "Adventure of Dragon", id: 2 },
    { title: "Little Red Robinhood", id: 3 },
  ];

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white">
      <Tabs defaultValue="your-stories" orientation="vertical" className="flex w-full min-h-screen">
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
