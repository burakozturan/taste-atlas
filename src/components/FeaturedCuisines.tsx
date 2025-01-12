import { motion } from "framer-motion";

const boxes = [
  {
    title: "Mediterranean Box",
    description: "A curated selection of premium olive oils, artisanal spices, and traditional preserves",
    price: "$49.99/month",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
  },
  {
    title: "Mesopotamian Box",
    description: "Ancient grains, exotic spice blends, and authentic cooking ingredients",
    price: "$54.99/month",
    image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb",
  },
];

export const FeaturedCuisines = () => {
  return (
    <section className="py-20 px-4 bg-stone-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 mb-4 text-sm bg-secondary/10 text-secondary rounded-full">
            Our Boxes
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Monthly Surprise Boxes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Each box is thoughtfully curated with authentic ingredients and delicacies from ancient culinary traditions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {boxes.map((box, index) => (
            <motion.div
              key={box.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={box.image}
                  alt={box.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {box.title}
                  </h3>
                  <p className="text-white/90 mb-4">
                    {box.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-white">
                      {box.price}
                    </span>
                    <button className="px-6 py-2 bg-white text-gray-900 rounded-full font-medium hover:bg-white/90 transition-colors">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};