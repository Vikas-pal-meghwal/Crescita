import FeatureList from "../components/home-page/feature";
import CategoryCards from "../components/home-page/category-card";
import ShopByDepartment from "../components/home-page/shop-by-department";
import Journal from "../components/home-page/journal";

const Home = () => {
  return (
    <div>
      {/* Hero — category bento grid */}
      <CategoryCards />

      {/* Product rows */}
      <div className="space-y-8 sm:space-y-20 mt-4 sm:mt-12">
        <FeatureList
          title="New Arrivals"
          subtitle="Fresh picks just landed"
          limit={20}
        />

        <ShopByDepartment />

        <FeatureList
          title="Fashion Products"
          subtitle="Curated styles for every occasion"
          category="Fashion"
          limit={20}
        />
      </div>



      {/* More products */}
      <div className="space-y-8 sm:space-y-20 mt-4 sm:mt-12">
        <FeatureList
          title="Beauty Essentials"
          subtitle="Skincare, makeup & more"
          category="Beauty"
          limit={20}
        />

        <FeatureList
          title="Home & Living"
          subtitle="Make your space feel like home"
          category="Home & Living"
          limit={20}
        />
      </div>

 

      {/* Journal / Blog */}
      <Journal />


    </div>
  );
};

export default Home;
