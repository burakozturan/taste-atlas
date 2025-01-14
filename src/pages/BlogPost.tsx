import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Edit } from "lucide-react";
import { useState } from "react";

const blogPosts = [
  {
    id: "1",
    title: "Ancient Grains of Mesopotamia",
    content: "Discover the rich history of grains that shaped civilization. From the fertile valleys of ancient Mesopotamia came the first cultivated wheat and barley, forever changing human society.",
    image: "/placeholder.svg",
    date: "March 15, 2024",
    category: "History"
  },
  {
    id: "2",
    title: "Mediterranean Spice Routes",
    content: "Journey through the historic spice trading paths that connected ancient civilizations. These routes were more than just trade networks - they were channels of cultural exchange.",
    image: "/placeholder.svg",
    date: "March 10, 2024",
    category: "Culture"
  },
  {
    id: "3",
    title: "Traditional Preservation Methods",
    content: "Learn about ancient food preservation techniques that have stood the test of time. From salting and smoking to fermentation, these methods ensured survival and created unique delicacies.",
    image: "/placeholder.svg",
    date: "March 5, 2024",
    category: "Techniques"
  }
];

const BlogPost = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const post = blogPosts.find(post => post.id === id);

  if (!post) {
    return <div>Post not found</div>;
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
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
          >
            <Edit className="h-4 w-4" />
            {isEditing ? "View Post" : "Edit Post"}
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
                defaultValue={post.content}
                placeholder="Write your content here (Markdown supported)..."
              />

              <div className="mt-6 flex justify-end">
                <button className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
                  Save Changes
                </button>
              </div>
            </>
          ) : (
            <article className="prose prose-stone lg:prose-lg max-w-none">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm text-gray-500">{post.date}</span>
                <span className="text-sm px-3 py-1 bg-accent/10 text-accent rounded-full">
                  {post.category}
                </span>
              </div>
              <img
                src={post.image}
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

export default BlogPost;