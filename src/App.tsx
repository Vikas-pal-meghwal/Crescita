import { Outlet, Route, Routes } from "react-router-dom";
import Footer from "./components/layout/footer";
import Header from "./components/layout/header";
import ProductDetails from "./pages/product-details";
import AllProducts from "./pages/all-products";
import Home from "./pages/Home";
import Contact from "./pages/connect";
import Wishlist from "./pages/wishlist";
import ScrollToTop from "./components/layout/scroll-to-top";

const App = () => {
  return (
    <Routes>

      <Route
        element={
          <>
            <ScrollToTop />
            <div className="fixed top-0 left-0 right-0 z-50">
              <Header />
            </div>
            <div className="h-[52px]" />{/* spacer for fixed header */}
            <div
              className={`transition-all duration-1000 ease-out min-h-[calc(100vh-100px)]`}
            >
              <Outlet />
            </div>
            <Footer />
          </>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/wishlist" element={<Wishlist />} />
      </Route>
    </Routes>
  );
};

export default App;