import FeatureList from "../components/home-page/feature";
import CategoryCards from "../components/home-page/category-card";

const Home = () => {
  return (
    <div>
      <CategoryCards />

      <div className="space-y-8 sm:space-y-20 mt-4 sm:mt-12 ">
        <FeatureList
          title="New Arrivals"
          subtitle="Fresh picks just landed"
          limit={20}
        />

        <FeatureList
          title="Fashion Products"
          subtitle="Curated styles for every occasion"
          category="Fashion"
          limit={20}
        />

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
    </div>
  );
};

export default Home;
