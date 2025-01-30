import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const BlogNavigation = () => {
  return (
    <Link 
      to="/" 
      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to Blog
    </Link>
  );
};