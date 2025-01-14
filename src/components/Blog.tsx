import { motion } from "framer-motion";

const blogPosts = [
  {
    id: 1,
    title: "Ancient Grains of Mesopotamia",
    excerpt: "Discover the rich history of grains that shaped civilization...",
    image: "/placeholder.svg",
    date: "March 15, 2024",
    category: "History"
  },
  {
    id: 2,
    title: "Mediterranean Spice Routes",
    excerpt: "Journey through the historic spice trading paths...",
    image: "/placeholder.svg",
    date: "March 10, 2024",
    category: "Culture"
  },
  {
    id: 3,
    title: "Traditional Preservation Methods",
    excerpt: "Learn about ancient food preservation techniques...",
    image: "/placeholder.svg",
    date: "March 5, 2024",
    category: "Techniques"
  }
];

export const Blog = () => {
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
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore the rich culinary heritage of Mediterranean and Mesopotamian regions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: post.id * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm text-gray-500">{post.date}</span>
                  <span className="text-sm px-3 py-1 bg-accent/10 text-accent rounded-full">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <button className="text-primary font-medium hover:text-primary/80 transition-colors">
                  Read More →
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};