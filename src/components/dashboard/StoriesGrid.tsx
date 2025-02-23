
import type { Story } from "@/types/database";
import { StoryCard } from "./StoryCard";

interface StoriesGridProps {
  stories?: Story[];
  isLoading: boolean;
  emptyMessage: string;
}

export const StoriesGrid = ({ stories, isLoading, emptyMessage }: StoriesGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stories?.map((story) => (
        <StoryCard key={story.id} story={story} />
      ))}
      {isLoading && (
        <div className="col-span-full text-center text-gray-400">
          Loading stories...
        </div>
      )}
      {!isLoading && !stories?.length && (
        <div className="col-span-full text-center text-gray-400">
          {emptyMessage}
        </div>
      )}
    </div>
  );
};
