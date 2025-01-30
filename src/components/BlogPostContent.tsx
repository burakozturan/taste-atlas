import { BlogPost } from "@/hooks/useBlogPosts";
import { format } from "date-fns";
import { Edit } from "lucide-react";
import { Button } from "./ui/button";

interface BlogPostContentProps {
  post: BlogPost;
  onEdit: () => void;
}

export const BlogPostContent = ({ post, onEdit }: BlogPostContentProps) => {
  return (
    <article className="prose prose-stone lg:prose-lg max-w-none">
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm text-gray-500">
          {format(new Date(post.date), 'MMMM d, yyyy')}
        </span>
        <span className="text-sm px-3 py-1 bg-accent/10 text-accent rounded-full">
          {post.category}
        </span>
      </div>
      <img
        src={post.image_url}
        alt={post.title}
        className="w-full h-64 object-cover rounded-lg mb-6"
      />
      <h1 className="text-3xl font-bold mb-6">{post.title}</h1>
      <p className="text-gray-600">{post.content}</p>
      
      <Button
        onClick={onEdit}
        className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
      >
        <Edit className="h-4 w-4" />
        Edit Post
      </Button>
    </article>
  );
};