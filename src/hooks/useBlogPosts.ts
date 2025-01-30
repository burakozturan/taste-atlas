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
        if (error.code === '42P01') {
          console.error('Blog posts table is missing. Please create it using the SQL commands shown in the toast message.');
          
          toast({
            title: '⚠️ Database Setup Required',
            description: 'The blog_posts table is missing. Please follow these steps:\n\n' +
              '1. Go to your Supabase dashboard\n' +
              '2. Open the SQL editor\n' +
              '3. Copy and paste the SQL commands below\n' +
              '4. Click "Run"\n\n' +
              '-- First, create the table and add sample data:\n' +
              'CREATE TABLE public.blog_posts (\n' +
              '  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n' +
              '  title TEXT NOT NULL,\n' +
              '  content TEXT NOT NULL,\n' +
              '  image_url TEXT NOT NULL,\n' +
              '  date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE(\'UTC\', NOW()),\n' +
              '  category TEXT NOT NULL\n' +
              ');\n\n' +
              'INSERT INTO public.blog_posts (title, content, image_url, date, category) VALUES\n' +
              '  (\'Ancient Grains of Mesopotamia\', \'Discover the rich history of grains that shaped civilization...\', \'/placeholder.svg\', NOW(), \'History\'),\n' +
              '  (\'Mediterranean Spice Routes\', \'Journey through the historic spice trading paths...\', \'/placeholder.svg\', NOW(), \'Culture\'),\n' +
              '  (\'Traditional Preservation Methods\', \'Learn about ancient food preservation techniques...\', \'/placeholder.svg\', NOW(), \'Techniques\');\n\n' +
              '-- Then, set up Row Level Security (RLS):\n' +
              'ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;\n\n' +
              'CREATE POLICY "Allow public read access"\n' +
              '  ON public.blog_posts\n' +
              '  FOR SELECT\n' +
              '  TO public\n' +
              '  USING (true);\n\n' +
              'CREATE POLICY "Allow authenticated users to update posts"\n' +
              '  ON public.blog_posts\n' +
              '  FOR UPDATE\n' +
              '  TO authenticated\n' +
              '  USING (true);',
            variant: 'destructive',
            duration: 15000,
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
      console.log('Updating post with data:', post);
      
      // First check if the post exists
      const { data: existingPost, error: checkError } = await supabase
        .from('blog_posts')
        .select()
        .eq('id', post.id)
        .limit(1)
        .single();

      if (checkError) {
        console.error('Error checking post existence:', checkError);
        toast({
          title: 'Error',
          description: 'Failed to verify post existence',
          variant: 'destructive',
        });
        throw checkError;
      }

      if (!existingPost) {
        const error = new Error('Post not found');
        toast({
          title: 'Post Not Found',
          description: 'This blog post does not exist. Please return to the blog listing.',
          variant: 'destructive',
        });
        throw error;
      }

      // If post exists, proceed with update
      const { data, error } = await supabase
        .from('blog_posts')
        .update({
          title: post.title,
          content: post.content,
          image_url: post.image_url,
          category: post.category,
        })
        .eq('id', post.id)
        .select()
        .limit(1)
        .single();

      if (error) {
        console.error('Error updating post:', error);
        toast({
          title: 'Error updating post',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      if (!data) {
        const updateError = new Error('Failed to update post');
        toast({
          title: 'Update Failed',
          description: 'The post could not be updated. Please try again.',
          variant: 'destructive',
        });
        throw updateError;
      }

      toast({
        title: 'Success',
        description: 'Blog post updated successfully',
      });
      
      return data as BlogPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
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