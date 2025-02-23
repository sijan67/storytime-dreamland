
import { ButtonGlow } from "@/components/ui/button-glow";
import { Save, Share2 } from "lucide-react";

interface StoryActionsProps {
  onSave: () => void;
  onShare: () => void;
}

export const StoryActions = ({ onSave, onShare }: StoryActionsProps) => {
  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <ButtonGlow
        onClick={onSave}
        className="flex items-center gap-2"
      >
        <Save className="w-5 h-5" />
        Save Story
      </ButtonGlow>

      <ButtonGlow
        onClick={onShare}
        className="flex items-center gap-2"
      >
        <Share2 className="w-5 h-5" />
        Share Story
      </ButtonGlow>
    </div>
  );
};
