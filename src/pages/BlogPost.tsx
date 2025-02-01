import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BlogPostEditor } from "@/components/BlogPostEditor";
import { BlogPostContent } from "@/components/BlogPostContent";
import { BlogNavigation } from "@/components/BlogNavigation";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const BlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { posts, isLoading, updatePost, uploadImage } = useBlogPosts();
  
  // Find the post immediately when posts are loaded
  const post = posts?.find(p => p.id === id);

  // Handle non-existent post
  useEffect(() => {
    if (!isLoading && !post) {
      toast({
        title: "Post Not Found",
        description: "This blog post doesn't exist.",
        variant: "destructive",
      });
    }
  }, [isLoading, post, toast]);

  const handleSave = async (title: string, content: string, imageFile: File | null) => {
    if (!post) {
      toast({
        title: "Error",
        description: "Cannot update a non-existent post.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      let imageUrl = post.image_url;
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      await updatePost.mutateAsync({
        id: post.id,
        title,
        content,
        image_url: imageUrl,
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-stone-50 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Post not found</AlertTitle>
            <AlertDescription>
              The blog post you're looking for doesn't exist or has been removed.
            </AlertDescription>
          </Alert>
          <Link to="/">
            <Button className="gap-2">
              <Home className="h-4 w-4" />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <BlogNavigation />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-8 shadow-md"
        >
          {isEditing ? (
            <BlogPostEditor
              post={post}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <BlogPostContent
              post={post}
              onEdit={() => setIsEditing(true)}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPostPage;
