
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileText, Edit, LogOut, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Story } from "@/types/database";
import { StarShape } from "@/components/dashboard/StarShape";
import { StoriesGrid } from "@/components/dashboard/StoriesGrid";

const Dashboard = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const { data: myStories, isLoading: isLoadingMyStories } = useQuery<Story[]>({
    queryKey: ['my-stories', user?.id],
    queryFn: async (): Promise<Story[]> => {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  const { data: publicStories, isLoading: isLoadingPublicStories } = useQuery<Story[]>({
    queryKey: ['public-stories'],
    queryFn: async (): Promise<Story[]> => {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-transparent to-purple-900/30 blur-3xl" />
      
      <div className="absolute inset-0">
        <StarShape delay={0.2} size={8} rotate={12} color="text-yellow-200" className="left-[10%] top-[15%]" />
        <StarShape delay={0.3} size={6} rotate={-15} color="text-yellow-100" className="right-[15%] top-[25%]" />
        <StarShape delay={0.4} size={7} rotate={8} color="text-yellow-300" className="left-[20%] bottom-[20%]" />
        <StarShape delay={0.5} size={5} rotate={20} color="text-yellow-200" className="right-[25%] top-[40%]" />
        <StarShape delay={0.6} size={6} rotate={-12} color="text-yellow-100" className="left-[30%] top-[60%]" />
        <StarShape delay={0.7} size={7} rotate={15} color="text-yellow-200" className="right-[35%] bottom-[30%]" />
        <StarShape delay={0.8} size={5} rotate={-20} color="text-yellow-300" className="left-[40%] top-[35%]" />
        <StarShape delay={0.9} size={6} rotate={25} color="text-yellow-100" className="right-[40%] top-[55%]" />
        <StarShape delay={1.0} size={5} rotate={30} color="text-yellow-200" className="left-[45%] bottom-[40%]" />
        <StarShape delay={1.1} size={5} rotate={-8} color="text-yellow-100" className="right-[48%] top-[20%]" />
        <StarShape delay={1.2} size={6} rotate={22} color="text-yellow-300" className="left-[52%] top-[45%]" />
        <StarShape delay={1.3} size={5} rotate={-25} color="text-yellow-200" className="right-[55%] bottom-[25%]" />
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
                <TabsTrigger value="read-stories" className="py-3">
                  <BookOpen size={16} strokeWidth={2} />
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="right" className="px-2 py-1 text-xs">
                Public Stories
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
            <StoriesGrid
              stories={myStories}
              isLoading={isLoadingMyStories}
              emptyMessage="No stories found. Create your first story!"
            />
          </TabsContent>
          
          <TabsContent value="read-stories" className="m-0">
            <h2 className="text-2xl font-bold mb-6">Public Stories</h2>
            <StoriesGrid
              stories={publicStories}
              isLoading={isLoadingPublicStories}
              emptyMessage="No public stories available yet."
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Dashboard;
