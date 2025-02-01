import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { format } from "date-fns";
import { useState } from "react";
import { ChevronDown, PlusCircle } from "lucide-react";
import { Button } from "./ui/button";

export const Blog = () => {
  const { posts, isLoading } = useBlogPosts();
  const [expandedPosts, setExpandedPosts] = useState<string[]>([]);

  const togglePost = (postId: string) => {
    setExpandedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const truncateContent = (content: string) => {
    const words = content.split(' ');
    if (words.length <= 50) return content;
    return words.slice(0, 50).join(' ') + '...';
  };

  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <motion.article
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-md"
              >
                <div className="w-full h-48 bg-gray-200 animate-pulse" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-8 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-stone-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1 mb-4 text-sm bg-primary/10 text-primary rounded-full">
            Our Blog
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Stories from the Ancient Kitchen
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Explore the rich culinary heritage of Mediterranean and Mesopotamian regions
          </p>
          <Link to="/create-post">
            <Button className="inline-flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create New Post
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts?.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm text-gray-500">
                    {format(new Date(post.date), 'MMMM d, yyyy')}
                  </span>
                  <span className="text-sm px-3 py-1 bg-accent/10 text-accent rounded-full">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {post.title}
                </h3>
                <div className="text-gray-600 mb-4">
                  <p>{expandedPosts.includes(post.id) ? post.content : truncateContent(post.content)}</p>
                  {post.content.split(' ').length > 50 && (
                    <button
                      onClick={() => togglePost(post.id)}
                      className="inline-flex items-center gap-2 text-primary font-medium mt-2 hover:text-primary/80 transition-colors"
                    >
                      {expandedPosts.includes(post.id) ? 'Show Less' : 'Read More'}
                      <ChevronDown 
                        className={`h-4 w-4 transition-transform ${
                          expandedPosts.includes(post.id) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>
                <Link 
                  to={`/blog/${post.id}`}
                  className="inline-flex items-center text-primary font-medium hover:text-primary/80 transition-colors"
                >
                  View Full Post →
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};