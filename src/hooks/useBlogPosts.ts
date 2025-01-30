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
      
      const updateData = {
        content,
        ...(image_url && { image_url })
      };

      const { data, error } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq('id', id)
        .select()
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

      return data as BlogPost;
    },
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(['blog-posts'], (oldPosts: BlogPost[] | undefined) => {
        if (!oldPosts) return [updatedPost];
        return oldPosts.map(post => 
          post.id === updatedPost.id ? updatedPost : post
        );
      });
      
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