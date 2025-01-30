import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Edit } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";

const BlogPostPage = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { toast } = useToast();
  const { posts, isLoading, updatePost, uploadImage } = useBlogPosts();
  const post = posts?.find(post => post.id === id);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContent(event.target.value);
  };

  const handleEditClick = () => {
    if (post) {
      setEditedContent(post.content);
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!post) return;
    
    try {
      let imageUrl = post.image_url;
      
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }

      const updatedPost = {
        ...post,
        content: editedContent,
        image_url: imageUrl,
      };

      await updatePost.mutateAsync(updatedPost);
      setIsEditing(false);
      setSelectedImage(null);

      // Show success toast
      toast({
        title: "Success",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving post:', error);
      // Show error toast
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
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          
          <Alert variant="destructive">
            <AlertDescription>
              Post not found. This could be because the blog posts table hasn't been created in the database yet.
              Please ensure the database is properly set up.
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
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <button
            onClick={isEditing ? () => setIsEditing(false) : handleEditClick}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
          >
            <Edit className="h-4 w-4" />
            {isEditing ? "Cancel Edit" : "Edit Post"}
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-8 shadow-md"
        >
          {isEditing ? (
            <>
              <div className="mb-8">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary/10 file:text-primary
                    hover:file:bg-primary/20"
                />
              </div>

              <textarea
                className="w-full min-h-[400px] p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={editedContent}
                onChange={handleContentChange}
                placeholder="Write your content here..."
              />

              <div className="mt-6 flex justify-end gap-4">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </>
          ) : (
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
            </article>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPostPage;