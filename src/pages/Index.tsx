import { useEffect } from "react";
import { Hero } from "@/components/Hero";
import { FeaturedCuisines } from "@/components/FeaturedCuisines";
import { Newsletter } from "@/components/Newsletter";
import { Blog } from "@/components/Blog";
import { motion, useScroll, useSpring } from "framer-motion";

const Index = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    document.title = "Taste Atlas - Culinary Journey Through Ancient Cuisines";
  }, []);

  return (
    <div className="relative">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
        style={{ scaleX }}
      />
      <Hero />
      <FeaturedCuisines />
      <Blog />
      <Newsletter />
    </div>
  );
};

export default Index;