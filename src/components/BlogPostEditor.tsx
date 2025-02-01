import { useState } from "react";
import { BlogPost } from "@/hooks/useBlogPosts";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface BlogPostEditorProps {
  post: BlogPost;
  onSave: (title: string, content: string, imageFile: File | null) => Promise<void>;
  onCancel: () => void;
}

export const BlogPostEditor = ({ post, onSave, onCancel }: BlogPostEditorProps) => {
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContent(event.target.value);
  };

  return (
    <div className="space-y-6">
      <div>
        <Input
          type="text"
          value={editedTitle}
          onChange={handleTitleChange}
          placeholder="Post title"
          className="text-xl font-bold mb-4"
        />
      </div>

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

      <div className="flex justify-end gap-4">
        <Button 
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          onClick={() => onSave(editedTitle, editedContent, selectedImage)}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};