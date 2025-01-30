import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BlogPostEditor } from "@/components/BlogPostEditor";
import { BlogPostContent } from "@/components/BlogPostContent";
import { BlogNavigation } from "@/components/BlogNavigation";

const BlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { posts, isLoading, updatePost, uploadImage } = useBlogPosts();
  const post = posts?.find(post => post.id === id);

  useEffect(() => {
    if (!isLoading && !post) {
      toast({
        title: "Post Not Found",
        description: "This blog post doesn't exist. Redirecting you to the blog listing.",
        variant: "destructive",
      });
      setTimeout(() => navigate("/"), 2000);
    }
  }, [isLoading, post, navigate, toast]);

  const handleSave = async (content: string, imageFile: File | null) => {
    if (!post) return;
    
    try {
      let imageUrl = post.image_url;
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      await updatePost.mutateAsync({
        ...post,
        content,
        image_url: imageUrl,
      });

      setIsEditing(false);

      toast({
        title: "Success",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
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
          <BlogNavigation />
          <Alert variant="destructive">
            <AlertDescription>
              Post not found. Redirecting you to the blog listing...
            </AlertDescription>
          </Alert>
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