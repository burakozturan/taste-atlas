import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  image_url: string;
  date: string;
  category: string;
}

export const useBlogPosts = () => {
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        // Check specifically for the missing table error
        if (error.code === '42P01') {
          const sqlInstructions = `
CREATE TABLE public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC', NOW()),
  category TEXT NOT NULL
);

-- Insert sample data
INSERT INTO public.blog_posts (title, content, image_url, date, category)
VALUES 
  ('Ancient Grains of Mesopotamia', 'Discover the rich history of grains that shaped civilization...', '/placeholder.svg', NOW(), 'History'),
  ('Mediterranean Spice Routes', 'Journey through the historic spice trading paths...', '/placeholder.svg', NOW(), 'Culture'),
  ('Traditional Preservation Methods', 'Learn about ancient food preservation techniques...', '/placeholder.svg', NOW(), 'Techniques');

-- Enable RLS and add policies
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access"
  ON public.blog_posts
  FOR SELECT
  TO anon
  USING (true);`;

          toast({
            title: 'Database Setup Required',
            description: `The blog_posts table is missing. Please go to your Supabase dashboard, open the SQL editor, and run the following SQL commands:\n\n${sqlInstructions}`,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error fetching posts',
            description: error.message,
            variant: 'destructive',
          });
        }
        throw error;
      }

      return data as BlogPost[];
    },
  });

  const updatePost = useMutation({
    mutationFn: async (post: BlogPost) => {
      const { error } = await supabase
        .from('blog_posts')
        .update(post)
        .eq('id', post.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast({
        title: 'Success',
        description: 'Blog post updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error updating post',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: 'Error uploading image',
        description: uploadError.message,
        variant: 'destructive',
      });
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  return {
    posts,
    isLoading,
    updatePost,
    uploadImage,
  };
};