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
      const { data: existingPost, error: checkError } = await supabase
        .from('blog_posts')
        .select()
        .eq('id', id)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking post:', checkError);
        toast({
          title: 'Error checking post',
          description: checkError.message,
          variant: 'destructive',
        });
        throw checkError;
      }

      if (!existingPost) {
        const error = new Error('Post not found');
        toast({
          title: 'Error',
          description: 'The blog post you are trying to update does not exist',
          variant: 'destructive',
        });
        throw error;
      }

      // If post exists, proceed with update
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
        const error = new Error('Failed to update post');
        toast({
          title: 'Error',
          description: 'Failed to update the blog post',
          variant: 'destructive',
        });
        throw error;
      }

      return data as BlogPost;
    },
    onSuccess: (updatedPost) => {
      // Immediately update the cache with the new data
      queryClient.setQueryData(['blog-posts'], (oldPosts: BlogPost[] | undefined) => {
        if (!oldPosts) return [updatedPost];
        return oldPosts.map(post => 
          post.id === updatedPost.id ? updatedPost : post
        );
      });
      
      // Also invalidate the query to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      
      toast({
        title: 'Success',
        description: 'Blog post updated successfully',
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