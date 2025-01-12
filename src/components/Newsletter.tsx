import { motion } from "framer-motion";

export const Newsletter = () => {
  return (
    <section className="py-20 px-4 bg-primary/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto text-center"
      >
        <span className="inline-block px-4 py-1 mb-4 text-sm bg-primary/10 text-primary rounded-full">
          Stay Updated
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Subscribe to Our Culinary Journey
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Get weekly updates on new recipes, cooking techniques, and cultural insights
        </p>
        
        <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-6 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            Subscribe
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
};