 import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/home/HeroSection";
import FeaturedDishes from "../components/home/FeaturedDishes";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Testimonials from "../components/home/Testimonials";
import Footer from "../components/home/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 overflow-hidden">
      <Navbar />
      <HeroSection />
      <FeaturedDishes />
      <WhyChooseUs />
      <Testimonials />
    
      <Footer />
    </div>
  );
};

export default Home;