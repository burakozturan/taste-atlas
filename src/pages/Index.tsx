import { Hero } from "@/components/Hero";
import { FeaturedCuisines } from "@/components/FeaturedCuisines";
import { Newsletter } from "@/components/Newsletter";
import { Blog } from "@/components/Blog";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

const Index = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
        style={{ scaleX }}
      />
      
      {/* Dropdown Menu */}
      <div className="fixed top-4 right-4 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md p-2 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary">
            <Menu className="h-6 w-6" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 bg-white">
            <DropdownMenuItem onSelect={() => scrollToSection('hero')}>
              Home
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => scrollToSection('featured')}>
              Featured Boxes
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => scrollToSection('blog')}>
              Blog
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => scrollToSection('newsletter')}>
              Newsletter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div id="hero">
        <Hero />
      </div>
      <div id="featured">
        <FeaturedCuisines />
      </div>
      <div id="blog">
        <Blog />
      </div>
      <div id="newsletter">
        <Newsletter />
      </div>
    </div>
  );
};

export default Index;