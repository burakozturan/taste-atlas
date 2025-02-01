import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BlogPost from "./pages/BlogPost";
import FeaturedBox from "./pages/FeaturedBox";
import NewsletterPage from "./pages/NewsletterPage";
import { CreateBlogPost } from "./components/CreateBlogPost";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/featured/:id" element={<FeaturedBox />} />
          <Route path="/newsletter" element={<NewsletterPage />} />
          <Route path="/create-post" element={<CreateBlogPost />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;