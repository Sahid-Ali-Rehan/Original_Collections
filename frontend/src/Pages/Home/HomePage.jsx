import AllCategories from "../../Components/AllCategories/AllCategories";
import BestSeller from "../../Components/BestSelling/BestSeller";
import HomeBanner from "../../Components/Crousels/HomeBanner";
import FeaturedProduct from "../../Components/FeaturedProduct/FeaturedProduct";
import Footer from "../../Components/Footer/Footer";
import Navbar from "../../Components/Navigations/Navbar";

const HomePage = () => {
    return (
      <div className="bg-[#FAEED5] w-full h-screen">
        <Navbar/>
        <HomeBanner/>
        <AllCategories/>
        <FeaturedProduct/>
        <BestSeller/>
        <Footer/>
      </div>
    );
  };
  
  export default HomePage;
  