
import { useNavigate } from "react-router-dom";
import type { Story } from "@/types/database";

interface StorySegment {
  text: string;
  imageUrl: string;
  image_description: string;
}

interface StoryContent {
  segments: StorySegment[];
  title: string;
  content: string;
}

interface StoryCardProps {
  story: Story;
}

export const StoryCard = ({ story }: StoryCardProps) => {
  const navigate = useNavigate();

  const getFirstSegment = (story: Story): { imageUrl?: string; text?: string } => {
    try {
      const content = JSON.parse(story.content) as StoryContent;
      if (content.segments && content.segments.length > 0) {
        return {
          imageUrl: content.segments[0].imageUrl,
          text: content.segments[0].text,
        };
      }
    } catch (error) {
      console.error('Error parsing story content:', error);
    }
    return {};
  };

  const firstSegment = getFirstSegment(story);

  return (
    <div
      className="p-6 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer space-y-4"
      onClick={() => navigate(`/story/${story.id}`)}
    >
      {firstSegment.imageUrl && (
        <div className="aspect-video rounded-lg overflow-hidden">
          <img
            src={firstSegment.imageUrl}
            alt={`Cover for ${story.title}`}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div>
        <h3 className="text-lg font-medium">{story.title}</h3>
        {firstSegment.text && (
          <p className="text-sm text-gray-400 mt-2 line-clamp-2">
            {firstSegment.text}
          </p>
        )}
        <p className="text-sm text-gray-400 mt-2">
          {new Date(story.created_at).toLocaleDateString()}
        </p>
        {story.is_public && (
          <span className="inline-block px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded mt-2">
            Public
          </span>
        )}
      </div>
    </div>
  );
};
