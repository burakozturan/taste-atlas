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
        console.error('Error fetching posts:', error);
        toast({
          title: 'Error fetching posts',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      return data as BlogPost[];
    },
  });

  const updatePost = useMutation({
    mutationFn: async ({ id, content, image_url }: { id: string; content: string; image_url?: string }) => {
      console.log('Updating post with data:', { id, content, image_url });
      
      // First check if the post exists
      const { data: existingPost, error: fetchError } = await supabase
        .from('blog_posts')
        .select()
        .eq('id', id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking post existence:', fetchError);
        toast({
          title: 'Error',
          description: 'Could not verify post existence',
          variant: 'destructive',
        });
        throw fetchError;
      }

      if (!existingPost) {
        const notFoundError = new Error('Blog post not found');
        toast({
          title: 'Error',
          description: 'The blog post you are trying to edit does not exist',
          variant: 'destructive',
        });
        throw notFoundError;
      }

      const { data, error: updateError } = await supabase
        .from('blog_posts')
        .update({ 
          content,
          ...(image_url && { image_url })
        })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (updateError) {
        console.error('Error updating post:', updateError);
        toast({
          title: 'Error updating post',
          description: updateError.message,
          variant: 'destructive',
        });
        throw updateError;
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